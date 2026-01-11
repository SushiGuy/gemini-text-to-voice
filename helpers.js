// Load environment variables from .env file
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        console.error("ERROR listing models:", error);
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
        console.error("ERROR listing audio models:", error);
    }
}

module.exports = {
    listAvailableModels,
    listGenerativeModels
};
