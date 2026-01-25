const { GoogleGenerativeAI } = require("@google/generative-ai");
const { saveProcessedWavFile } = require('./helpers-audio');
const { formulateGeminiPromptString } = require('./helpers');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Synthesizes speech from the provided text and saves it to a file using the Gemini API.
 * @param {string} text The text to synthesize.
 * @param {string} voiceName The name of the voice to use.
 * @param {string} outputFile The path to save the output file to.
 */
async function textToVoiceTts(text, tone, accent, voiceName, outputFile) {
    try {
        console.log(`🔊 Generating speech for voice: ${voiceName}`);
        console.log('Please wait, this could take a minute...');
        // Use a model that supports multimodal output
        // gemini-2.5-flash-preview-tts -- Recommended for speed/cost - WORKING! 10 requests/day, Use method "generateContent"
        // gemini-2.5-pro-preview-tts -- Recommended for studio-quality voiceovers, Key Feature: These allow you to "direct" the voice using natural language. You can include instructions like "Say cheerfully:" or "Speak in a slow, spooky whisper:" directly in your prompt.
        //const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-tts" }); // WORKING AS OF 1/25/2026 but result less impressive than flash-preview-tts
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-tts" }); // WORKING AS OF 1/25/2026

        const result = await model.generateContent({
            contents: [{    
                role: "user", 
                parts: [{ 
                    text: formulateGeminiPromptString(tone, accent, text) 
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
