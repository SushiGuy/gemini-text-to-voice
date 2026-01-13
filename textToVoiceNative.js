require('dotenv').config();

const WebSocket = require('ws');
const fs = require("fs");
const { WaveFile } = require("wavefile");

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

// Use a model that supports multimodal output
// gemini-2.0-flash-exp	-- Only model open for the free tier. Use it for Real-time conversation (The initial experimental model that introduced the Live API)
// NOPE gemini-2.5-flash-native-audio-preview-09-2025 - AI Studio
// NOPE gemini-2.5-flash-native-audio-preview-12-2025 - AI Studio -- The most stable 2026 model for live "native" voice (Best for low-latency, high-quality native audio)
// NOPE gemini-live-2.5-flash-native-audio - Vertext AI -- Must create a service account
const GEMINI_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

function saveWavFile(pcmBuffer, outputFile) {
    const wav = new WaveFile();
    // 1 Channel, 24kHz, 16-bit is the Native Audio standard
    wav.fromScratch(1, 24000, "16", pcmBuffer);
    fs.writeFileSync(outputFile, wav.toBuffer());
    console.log(`✅ Success! Native audio saved (Size: ${pcmBuffer.length} bytes)`);
}

/**
 * Synthesizes speech from text using a direct WebSocket connection to the Gemini API.
 * @param {string} text The text to synthesize.
 * @param {string} voiceName The name of the voice to use.
 * @param {string} outputFile The path to save the output file to.
 */
async function textToVoiceNative(text, voiceName, outputFile) {
    if (!API_KEY) {
        console.error("Please set your GEMINI_API_KEY in a .env file.");
        return;
    }

    const ws = new WebSocket(URL);
    let audioChunks = [];

    ws.on('open', () => {
        console.log('Connected to Gemini Live API');

        // 1. Send Setup Message
        const setupMessage = {
            setup: {
                model: `models/${GEMINI_MODEL}`,
                generation_config: {
                    response_modalities: ["AUDIO"],
                    speech_config: {
                        voice_config: { prebuilt_voice_config: { voice_name: voiceName } }
                    }
                }
            }
        };
        ws.send(JSON.stringify(setupMessage));
    });

    ws.on('message', (data) => {
        console.log('Received message from server:', data.toString());
        const response = JSON.parse(data);

        // 2. Handle the Setup Confirmation
        if (response.setupComplete) {
            console.log('Setup complete. Sending text...');
            const clientContent = {
                client_content: {
                    turns: [{ role: "user", parts: [{ text: text }] }],
                    turn_complete: true
                }
            };
            ws.send(JSON.stringify(clientContent));
        }

        // 3. Collect Audio Chunks
        if (response.serverContent && response.serverContent.modelTurn) {
            const parts = response.serverContent.modelTurn.parts;
            parts.forEach(part => {
                if (part.inlineData && part.inlineData.mimeType === 'audio/pcm;rate=24000') {
                    console.log('Received audio chunk.');
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    audioChunks.push(buffer);
                }
            });
        }

        // Check if the model has finished speaking
        if (response.serverContent && response.serverContent.turnComplete) {
            console.log(`Turn complete. Saving file ${outputFile}...`);
            if (audioChunks.length > 0) {
                const pcmBuffer = Buffer.concat(audioChunks);
                saveWavFile(pcmBuffer, outputFile);
            } else {
                console.log('No audio chunks received, file not saved.');
            }
            ws.close();
        }
    });

    ws.on('error', (err) => console.error('Socket Error:', err));
    ws.on('close', (code, reason) => {
        console.log(`Socket connection closed. Code: ${code}`);
    });
}

module.exports = { textToVoiceNative };