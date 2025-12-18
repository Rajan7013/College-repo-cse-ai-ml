import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

// Using gemini-2.5-flash - the exact model the user requested!
// This is available on their API key as confirmed by the models list.
export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});
