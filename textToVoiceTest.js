const WebSocket = require('ws');
const { GoogleGenAI } = require("@google/genai");
const { saveWavFile } = require('./helpers');

require('dotenv').config();

// Use the 12-2025 version which is currently the stable preview for Bidi
const modelId = "gemini-2.5-flash-native-audio-preview-12-2025";

/**
 * Synthesizes speech from text using a direct WebSocket connection to the Gemini API.
 * @param {string} text The text to synthesize.
 * @param {string} voiceName The name of the voice to use.
 * @param {string} outputFile The path to save the output file to.
 */
async function textToVoiceTest(text, voiceName, outputFile) {
    // 1. Initialize with v1beta (CRITICAL for Bidi/Live API)
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        apiVersion: "v1beta"
    });

    try {
        let audioChunks = [];

//REVERT ALL BELOW, ACCIDENTALLY OVERWROTE CLAUDE CODE SOLUTION WITH textToVoiceTest.js approach

        // 2. Open the Live connection with callbacks
        const session = await ai.live.connect({
            model: modelId,
            config: {
                responseModalities: ["audio"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName }
                    }
                }
            },
            callbacks: {
                onopen: () => {
                    console.log("Connected to Bidi Session...");
                },
                onmessage: (event) => {
                    console.log("Received message from server:", event.data);
                    const message = JSON.parse(event.data);

                    // Check for audio data in the server turn
                    const data = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (data) {
                        console.log("Received audio chunk.");
                        audioChunks.push(Buffer.from(data, "base64"));
                    }

                    // Save and close when turn is complete
                    if (message.serverContent?.turnComplete) {
                        console.log("Turn complete. Saving audio...");
                        if (audioChunks.length > 0) {
                            saveWavFile(audioChunks, outputFile);
                        } else {
                            console.log("No audio chunks received, file not saved.");
                        }
                        session.close();
                    }
                },
                onclose: () => {
                    console.log("Bidi session closed.");
                },
                onerror: (err) => {
                    console.error("❌ Bidi Connection Error:", err.message);
                }
            }
        });

        // 4. Send Content now that the session is established
        console.log("Sending text to session...");
        session.sendClientContent({
            turns: [{
                role: 'user',
                parts: [{ text: text }]
            }],
            turnComplete: true
        });

    } catch (error) {
        console.error("❌ Bidi Connection Failed:", error.message);
        if (error.message.includes("1008")) {
            console.log("Tip: Check if your API Key is from AI Studio and the model is correct.");
        }
    }
}

module.exports = { textToVoiceTest };