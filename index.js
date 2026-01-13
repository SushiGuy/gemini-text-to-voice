const { listAvailableModels, listGenerativeModels } = require("./helpers");
const { textToVoiceNative } = require("./textToVoiceNative");
const { textToVoiceTts } = require("./textToVoiceTts");
const { textToVoiceTest } = require("./textToVoiceTest");

// Load environment variables from .env file
require('dotenv').config();

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
const outputFileNameTts = 'output-tts.wav';

// Native audio specific strings
const nativeAudioText = 'This is a test of the native audio engine.';
const nativeAudioVoice = 'Puck'; // Change this to "Aoede", "Charon", "Fenrir", "Kore", or "Puck"
const nativeAudioOutputFile = 'output-live.wav';

// The following code will only run if the file is executed directly.
if (require.main === module) {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Please set your GEMINI_API_KEY in a .env file.");
    } else if (process.argv[2] === 'list-models') {
        listAvailableModels();
    } else if (process.argv[2] === 'list-gen-models') {
        listGenerativeModels();
    } else if (process.argv[2] === 'tts-mode') {
        textToVoiceTts(textToConvert, chosenVoice, outputFileNameTts);
    } else if (process.argv[2] === 'live-mode') {
        textToVoiceNative(nativeAudioText, nativeAudioVoice, nativeAudioOutputFile);
    } else if (process.argv[2] === 'test-mode') {
        textToVoiceTest(nativeAudioText, nativeAudioVoice, nativeAudioOutputFile);
    } else if (!textToConvert || !chosenVoice || (!outputFileNameTts || !nativeAudioOutputFile)) {
        console.error('Please set the textToConvert, chosenVoice, and outputFileName variables.');
    } else {
        textToVoiceTts(textToConvert, chosenVoice, outputFileNameTts);
    }
}

module.exports = {
    textToVoiceNative,
    textToVoiceTts,
    textToVoiceTest,
    listAvailableModels,
    listGenerativeModels
};