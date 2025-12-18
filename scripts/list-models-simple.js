
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
    console.error("No API KEY found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("VALID MODELS FOUND:");
                json.models.forEach(m => {
                    // Filter for flash models
                    if (m.name.includes("flash")) {
                        console.log(m.name.replace('models/', ''));
                    }
                });
            } else {
                console.log("No models returned. Error:", json);
            }
        } catch (e) {
            console.error("Parse error", e);
        }
    });
}).on('error', (e) => {
    console.error("Request error", e);
});
