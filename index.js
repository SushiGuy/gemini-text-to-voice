const { listAvailableModels, listGenerativeModels } = require("./helpers");
const { textToVoiceNative } = require("./textToVoiceNative");
const { textToVoiceTts } = require("./textToVoiceTts");

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
const chosenVoice = 'Zephyr';  // See Readme for full voice list
const outputFileNameTts = 'output-tts.wav';

// Native audio specific strings
const nativeAudioText = 'This is a test of the native audio engine.';
const nativeAudioVoice = 'Aoede';  // See Readme for full voice list
const nativeAudioOutputFile = 'output-live.wav';

// The following code will only run if the file is executed directly.
if (require.main === module) {
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ Please set your GEMINI_API_KEY in a .env file.");
        process.exit(1);
    }
    
    const command = process.argv[2];
    
    switch (command) {
        case 'list-models':
            listAvailableModels();
            break;
        case 'list-gen-models':
            listGenerativeModels();
            break;
        case 'tts-mode':
            textToVoiceTts(textToConvert, chosenVoice, outputFileNameTts);
            break;
        case 'live-mode':
            textToVoiceNative(nativeAudioText, nativeAudioVoice, nativeAudioOutputFile);
            break;
        default:
            console.log('Usage: npm start <command>');
            console.log('\nAvailable commands:');
            console.log('  list-models     - List all available Gemini models');
            console.log('  list-gen-models - List models with generateContent support');
            console.log('  tts-mode        - Generate speech using TTS API');
            console.log('  live-mode       - Generate speech using Live WebSocket API');
            break;
    }
}

module.exports = {
    textToVoiceNative,
    textToVoiceTts,
    listAvailableModels,
    listGenerativeModels
};