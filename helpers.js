// Load environment variables from .env file
require('dotenv').config();

/**
 * Analyzes WebSocket close codes and returns a human-readable message.
 * @param {number} code The WebSocket close code.
 * @returns {string} A description of what the close code means.
 */
function getCloseCodeMessage(code) {
    const messages = {
        1000: '✅ Normal closure - Connection completed successfully',
        1001: '✅ Going away - Endpoint is going away (e.g., server shutdown)',
        1002: '⚠️ Protocol error - WebSocket protocol violation',
        1003: '⚠️ Unsupported data - Received data type cannot be accepted',
        1005: '⚠️ No status received - Connection closed without a close frame',
        1006: '⚠️ Abnormal closure - Connection dropped without proper close',
        1007: '❌ Invalid frame payload - Message contained invalid data',
        1008: '❌ Policy violation - Message violates endpoint policy',
        1009: '❌ Message too big - Message exceeds size limit',
        1010: '❌ Missing extension - Client expected an extension the server didn\'t provide',
        1011: '❌ Internal error - Server encountered an unexpected condition',
        1012: '⚠️ Service restart - Server is restarting',
        1013: '⚠️ Try again later - Server is temporarily unavailable',
        1014: '❌ Bad gateway - Server acting as gateway received invalid response',
        1015: '❌ TLS handshake failed - Connection failed due to TLS error'
    };

    return messages[code] || `❓ Unknown close code: ${code}`;
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

/**
 * Prepares gemini prompt string for generating the audio
 */
function formulateGeminiPromptString(tone, accent, text) {
    let promptString = null;
    if (tone && accent) {
        promptString = `Say with a ${accent} accent, in a ${tone} tone: "${text}"`;
    } else if (accent) {
        promptString = `Say with a ${accent} accent: "${text}"`;
    } else if (tone) {
        promptString = `Say in a ${tone} tone: "${text}"`;
    } else {
        promptString = `Say: "${text}"`;
    }
    console.log(`Gemini Prompt: ${promptString}`);
    return promptString;
}

module.exports = {
    listAvailableModels,
    listGenerativeModels,
    getCloseCodeMessage,
    formulateGeminiPromptString
};
