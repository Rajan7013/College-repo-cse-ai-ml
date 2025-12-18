
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No GEMINI_API_KEY found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // For listing models, we can't use the helper directly easily in some versions, 
        // but let's try the standard way if available, or just use fetch.
        // The SDK might not expose listModels on the main instance in older versions, 
        // but let's try assuming it's up to date.
        // Actually, looking at docs, it's usually separate. 
        // Let's use a direct fetch to be safe and independent of SDK version quirks.

        console.log("Fetching models with key ending in " + apiKey.slice(-4));
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.name.includes("flash")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.error("Error listing models:", data);
        }
    } catch (error) {
        console.error("List failed:", error);
    }
}

listModels();
