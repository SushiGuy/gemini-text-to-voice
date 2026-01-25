const { listAvailableModels, listGenerativeModels } = require("./helpers");
const { textToVoiceNative } = require("./textToVoiceNative");
const { textToVoiceTts } = require("./textToVoiceTts");
const { VOICES } = require("./helpers-audio.js");

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

const chosenVoice = VOICES.DESPINA;  // See Readme for full voice list
const textToConvert = `This is my voice, called ${chosenVoice}. What do you think about it?`;
const voiceTone = '';//'slow, compassionate';
const voiceAccent = '';//'English';
const outputFileNameTts = `output-tts-${chosenVoice}-${voiceAccent}-${voiceTone.replace(/, /g, '-')}.wav`;

// Native audio specific strings
const nativeVoiceName = VOICES.AOEDE;  // See Readme for full voice list
const nativeAudioText = `This is my voice, called ${nativeVoiceName}. What do you think about it?`;
const nativeTone = 'slow, compassionate';
const nativeAccent = 'English';
const nativeOutputFilename = `output-live-${nativeVoiceName}-${nativeAccent}-${voiceTone.replace(/, /g, '-')}.wav`;

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
            textToVoiceTts(textToConvert, voiceTone, voiceAccent, chosenVoice, outputFileNameTts);
            break;
        case 'tts-samples':
            // Generate sample TTS files for all voices
            (async () => {
                for (const voiceKey in VOICES) {
                    const voiceName = VOICES[voiceKey];
                    const sampleText = `This is my voice, called ${voiceName}. What do you think about it?`;
                    const sampleOutputFile = `output-tts-sample-${voiceName}.wav`;
                    console.log(`\nGenerating sample for voice: ${voiceName}`);
                    await textToVoiceTts(sampleText, '', '', voiceName, sampleOutputFile);
                    console.log('Pausing for 1 second to avoid rate limiting...');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second pause
                }
            })();
            break;
        case 'live-mode':
            textToVoiceNative(nativeAudioText, nativeTone, nativeAccent, nativeVoiceName, nativeOutputFilename);
            break;
        default:
            console.log('Usage: npm start <command>');
            console.log('\nAvailable commands:');
            console.log('  list-models      - List all available Gemini models');
            console.log('  list-gen-models  - List models with generateContent support');
            console.log('  tts-mode         - Generate speech using TTS API');
            console.log('  tts-samples      - Generate short samples of each voice');
            console.log('  live-mode        - Generate speech using Live WebSocket API');
            break;
    }
}

module.exports = {
    textToVoiceNative,
    textToVoiceTts,
    listAvailableModels,
    listGenerativeModels
};