const { GoogleGenerativeAI } = require("@google/generative-ai");
const { saveWavFile } = require('./helpers');
const { saveProcessedWavFile } = require('./helpers-audio');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Synthesizes speech from the provided text and saves it to a file using the Gemini API.
 * @param {string} text The text to synthesize.
 * @param {string} voiceName The name of the voice to use.
 * @param {string} outputFile The path to save the output file to.
 */
async function textToVoiceTts(text, voiceName, outputFile) {
    try {
        console.log(`🔊 Generating speech for voice: ${voiceName}`);
        console.log('Please wait, this could take a minute...');
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
            // Convert Base64 to Buffer and process with improved audio pipeline
            let pcmBuffer = Buffer.from(audioPart.inlineData.data, "base64");

            // Use the new improved audio processing from helpers-audio.js
            saveProcessedWavFile(pcmBuffer, outputFile);
        } else {
            console.error("❌ Model returned text response or no audio:", result.response.text());
        }
    } catch (error) {
        console.error("❌ General error:", error.message);
    }
}

module.exports = { textToVoiceTts };
