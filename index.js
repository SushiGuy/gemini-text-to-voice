const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: text }] }],
            generationConfig: {
                // responseMimeType: "audio/wav", // This is another way to get audio output
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

        // The API returns the audio data as a base64 string
        const audioData = result.response.candidates[0].content.parts[0].inlineData.data;
        const buffer = Buffer.from(audioData, "base64");

        // Save the file
        fs.writeFileSync(outputFile, buffer);
        console.log(`Audio saved successfully as ${outputFile}`);

    } catch (error) {
        console.error("ERROR:", error);
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
const chosenVoice = 'Puck'; // Change this to "Aoede", "Charon", "Fenrir", "Kore", or "Puck"
const outputFileName = 'output.wav';

// The following code will only run if the file is executed directly.
if (require.main === module) {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Please set your GEMINI_API_KEY in a .env file.");
    } else if (!textToConvert || !chosenVoice || !outputFileName) {
        console.error('Please set the textToConvert, chosenVoice, and outputFileName variables.');
    } else {
        textToVoice(textToConvert, chosenVoice, outputFileName);
    }
}

module.exports = { textToVoice };