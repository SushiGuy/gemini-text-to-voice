// Load environment variables from .env file
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { WaveFile } = require("wavefile");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Saves PCM audio data as a WAV file.
 * @param {Buffer|Buffer[]} pcmData A buffer or array of buffers containing PCM audio data.
 * @param {string} outputFile The path to save the output file to.
 */
function saveWavFile(pcmData, outputFile) {
    const pcmBuffer = Array.isArray(pcmData) ? Buffer.concat(pcmData) : pcmData;
    console.log(`📊 PCM Buffer size: ${pcmBuffer.length} bytes`);
    const wav = new WaveFile();

    // 1 Channel (Mono), 24kHz, 16-bit is the Gemini Audio standard
    wav.fromScratch(1, 24000, "16", pcmBuffer);
    fs.writeFileSync(outputFile, wav.toBuffer());
    console.log('Saving audio to ', outputFile);
    console.log(`✅ Success! Audio file saved (Size: ${pcmBuffer.length} bytes)`);
}

/**
 * Lists all available models from the Gemini API.
 */
async function listAvailableModels() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            for (const model of data.models) {
                console.log(`- ${model.name} (Display Name: ${model.displayName})`);
            }
        } else {
            console.log(data);
        }
    } catch (error) {
        console.error("❌ Error listing models:", error);
    }
}

/**
 * Lists available models that support generateContent.
 */
async function listGenerativeModels() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );
        const data = await response.json();
        console.log("Models with generateContent support:");
        if (data.models) {
            const audioModels = data.models.filter(model => 
                model.supportedGenerationMethods && 
                model.supportedGenerationMethods.includes("generateContent")
            );
            if (audioModels.length > 0) {
                for (const model of audioModels) {
                    console.log(`- ${model.name} (Display Name: ${model.displayName})`);
                    if (model.supportedGenerationMethods) {
                        console.log(`  Methods: ${model.supportedGenerationMethods.join(", ")}`);
                    }
                }
            } else {
                console.log("No models found with generateContent support.");
            }
        } else {
            console.log(data);
        }
    } catch (error) {
        console.error("❌ Error listing audio models:", error);
    }
}

module.exports = {
    listAvailableModels,
    listGenerativeModels,
    saveWavFile
};
