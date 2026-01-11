const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { WaveFile } = require("wavefile");
const { listAvailableModels, listGenerativeModels } = require("./helpers");

// Load environment variables from .env file
require('dotenv').config();

// Replace with your actual API Key in the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Synthesizes speech from the provided text and saves it to a file using the Gemini API.
 * @param {string} text The text to synthesize.
 * @param {string} voiceName The name of the voice to use.
 * @param {string} outputFile The path to save the output file to.
 */
async function textToVoice(text, voiceName, outputFile) {
    // A selection of available voices.
    // Options: Aoede, Charon, Fenrir, Kore, Puck
    // These voices are part of the Gemini family of models.

    try {
        // Use a model that supports multimodal output, like gemini-1.5-pro
        // gemini-2.0-flash-exp is the experimental multimodal version of the model which can give audio files back. The reason gemini-2.0-flash-exp gives you a Limit: 0 error even with billing enabled is that Google "shadow-banned" free-tier audio generation for that specific model in December 2025 to combat fraud.
        // gemini-2.5-flash gives error "[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [400 Bad Request] This model only supports text output."
        // gemini-2.5-flash-live also gives error "[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-live:generateContent: [404 Not Found] models/gemini-2.5-flash-live is not found for API version v1beta, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods."
        // gemini-2.5-flash-native-audio-preview-12-2025
        // gemini-2.5-flash-preview-tts -- THIS IS IT
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

// --- Example Usage ---
// To run this example, you first need to install the dependencies and set up your Gemini API Key.
// See the README.md file for instructions.
//
// You can then run the script from your terminal:
// node index.js
//
// You can change the text and voice by modifying the variables below.

const textToConvert = 'Hello, this is a test of the Gemini text-to-speech API with the new voices.';
const chosenVoice = 'Charon'; // Change this to "Aoede", "Charon", "Fenrir", "Kore", or "Puck"
const outputFileName = 'output.wav';

// The following code will only run if the file is executed directly.
if (require.main === module) {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Please set your GEMINI_API_KEY in a .env file.");
    } else if (process.argv[2] === '--list-models') {
        listAvailableModels();
    } else if (process.argv[2] === '--list-gen-models') {
        listGenerativeModels();
    } else if (!textToConvert || !chosenVoice || !outputFileName) {
        console.error('Please set the textToConvert, chosenVoice, and outputFileName variables.');
    } else {
        textToVoice(textToConvert, chosenVoice, outputFileName);
    }
}

module.exports = {
    textToVoice,
    listAvailableModels,
    listGenerativeModels
};