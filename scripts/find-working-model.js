
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
let apiKey = null;
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1]) apiKey = match[1].trim().replace(/['"]/g, '');
} catch (e) { }

if (!apiKey) {
    fs.writeFileSync(path.join(__dirname, 'working-model.txt'), "ERROR: No API Key");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const candidates = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-pro'
];

async function check() {
    for (const modelName of candidates) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            if (response.text()) {
                fs.writeFileSync(path.join(__dirname, 'working-model.txt'), modelName);
                console.log(`SUCCESS: ${modelName}`);
                process.exit(0);
            }
        } catch (e) {
            console.log(`FAIL ${modelName}: ${e.message}`);
        }
    }
    fs.writeFileSync(path.join(__dirname, 'working-model.txt'), "NONE");
}

check();
