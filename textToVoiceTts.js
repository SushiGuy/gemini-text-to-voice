const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const { WaveFile } = require('wavefile');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Synthesizes speech from the provided text and saves it to a file using the Gemini API.
 * @param {string} text The text to synthesize.
 * @param {string} voiceName The name of the voice to use.
 * @param {string} outputFile The path to save the output file to.
 */
async function textToVoiceTts(text, voiceName, outputFile) {
    // A selection of available voices.
    // Options: Aoede, Charon, Fenrir, Kore, Puck
    // These voices are part of the Gemini family of models.

    try {
        // Use a model that supports multimodal output
        // gemini-2.0-flash-exp	-- Use for Real-time conversation, Use method "bidiGenerateContent"
        // gemini-2.5-flash-preview-tts -- Recommended for speed/cost - WORKING! 10 requests/day, Use method "generateContent"
        // gemini-2.5-pro-preview-tts -- Recommended for studio-quality voiceovers, Key Feature: These allow you to "direct" the voice using natural language. You can include instructions like "Say cheerfully:" or "Speak in a slow, spooky whisper:" directly in your prompt.
        // gemini-2.5-flash-native-audio-preview-12-2025 -- The most stable 2026 model for live "native" voice
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-tts" });

        const result = await model.generateContent({
            contents: [{    
                role: "user", 
                parts: [{ 
                    text: `Convert the following text to audio only. Do not generate any text response, only audio: "${text}"` 
                }] 
            }],
            generationConfig: {
                //responseMimeType: "audio/wave",
                responseModalities: ["audio"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: voiceName,
                        },
                    },
                },
            },
        });

        const response = await result.response;

        // Extract the audio from the multimodal response
        const audioPart = response.candidates[0].content.parts.find(p => p.inlineData);

        if (audioPart && audioPart.inlineData) {
            // 1. Convert Base64 to Buffer
            const pcmBuffer = Buffer.from(audioPart.inlineData.data, "base64");

            console.log(`📊 PCM Buffer size: ${pcmBuffer.length} bytes`);

            // 2. Create a new WaveFile object
            const wav = new WaveFile();

            // 3. Create the WAV file from the raw PCM data
            // API returns: 1 channel (mono), 24000Hz, 16-bit
            // Some 2026 updates shifted the TTS to 16kHz
            // Try 16000 if 24000 sounds scratchy; this is the common 2026 'fallback'
            const sampleRate = 24000; // or 16000
            wav.fromScratch(1, sampleRate, '16', pcmBuffer);

            // 4. Write the file to disk
            fs.writeFileSync(outputFile, wav.toBuffer());
            console.log(`✅ Success! Playable file saved: ${outputFile}`);
        } else {
            console.error("❌ Model returned text response or no audio:", result.response.text());
        }
    } catch (error) {
        console.error("❌ General error:", error.message);
    }
}

module.exports = { textToVoiceTts };
