const fs = require("fs");
const { WaveFile } = require("wavefile");

/**
 * Analyzes raw PCM buffer to help diagnose audio issues
 */
function analyzePCMBuffer(pcmBuffer) {
    const dataInt16 = new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, pcmBuffer.length / 2);
    let maxVal = 0;
    let minVal = 0;
    let sum = 0;
    let nonZeroCount = 0;
    
    for (let i = 0; i < dataInt16.length; i++) {
        const val = dataInt16[i];
        if (val > maxVal) maxVal = val;
        if (val < minVal) minVal = val;
        sum += Math.abs(val);
        if (val !== 0) nonZeroCount++;
    }
    
    const avgAmplitude = sum / dataInt16.length;
    const percentNonZero = (nonZeroCount / dataInt16.length) * 100;
    
    console.log('📊 PCM Buffer Analysis:');
    console.log(`   Total samples: ${dataInt16.length}`);
    console.log(`   Max value: ${maxVal} (should be near ±32767 for loud audio)`);
    console.log(`   Min value: ${minVal}`);
    console.log(`   Avg amplitude: ${avgAmplitude.toFixed(2)}`);
    console.log(`   Non-zero samples: ${percentNonZero.toFixed(1)}%`);
    console.log(`   Dynamic range: ${((maxVal / 32767) * 100).toFixed(1)}% of maximum`);
    
    return { maxVal, minVal, avgAmplitude, percentNonZero };
}

/**
 * Improved WAV file saving with proper audio processing pipeline.
 * This EXACTLY matches the working gemini-voice-studio pattern.
 */
function saveProcessedWavFile(pcmBuffer, outputFile, sampleRate = 24000, numChannels = 1) {
    console.log(`📊 Processing PCM Buffer size: ${pcmBuffer.length} bytes`);
    
    // Diagnostic: Analyze the raw buffer first
    analyzePCMBuffer(pcmBuffer);
    
    // Step 1: Create Int16Array view of the raw PCM data
    const dataInt16 = new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, pcmBuffer.length / 2);
    const frameCount = dataInt16.length / numChannels;
    
    // Step 2: Convert Int16 to Float32 (exactly like decodeAudioData in audioUtils.ts)
    const audioData = new Float32Array(frameCount * numChannels);
    for (let i = 0; i < dataInt16.length; i++) {
        // Scaling by 32768.0 is crucial to avoid distortion and low volume
        audioData[i] = dataInt16[i] / 32768.0;
    }
    
    // Step 3: Normalize the Float32 audio data (exactly like normalizeAudio in audioUtils.ts)
    let maxVal = 0;
    for (let i = 0; i < audioData.length; i++) {
        const abs = Math.abs(audioData[i]);
        if (abs > maxVal) maxVal = abs;
    }
    
    if (maxVal > 0) {
        const multiplier = 0.95 / maxVal; // Scale to 95% peak
        for (let i = 0; i < audioData.length; i++) {
            audioData[i] *= multiplier;
        }
    }
    
    console.log(`   Normalization: maxVal=${maxVal.toFixed(4)}, multiplier=${(0.95 / maxVal).toFixed(4)}`);
    
    // Step 4: Convert back to Int16 (exactly like audioBufferToWav in audioUtils.ts)
    const processedInt16 = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i]));
        processedInt16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    
    // Step 5: Create WAV file manually (like audioBufferToWav)
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataLength = processedInt16.length * bytesPerSample;
    const bufferSize = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    // Write WAV header
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Write audio samples
    let offset = 44;
    for (let i = 0; i < processedInt16.length; i++) {
        view.setInt16(offset, processedInt16[i], true);
        offset += 2;
    }
    
    // Save to file
    fs.writeFileSync(outputFile, Buffer.from(arrayBuffer));
    console.log('Saving processed audio to', outputFile);
    console.log(`✅ Success! Processed audio file saved (${bufferSize} bytes total, ${dataLength} bytes audio data)`);
}

module.exports = {
    analyzePCMBuffer,
    saveProcessedWavFile
};