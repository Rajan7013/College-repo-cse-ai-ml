import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.warn("GROQ_API_KEY is not set in environment variables. AI features will not work.");
}

export const groqClient = new Groq({
    apiKey: apiKey || 'dummy-key',
});

// Using Llama 3.3 70B - Fast, powerful, and free!
export const GROQ_MODEL = "llama-3.3-70b-versatile";
