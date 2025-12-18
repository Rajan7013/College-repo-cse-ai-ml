
const https = require('https');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
let apiKey = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim().replace(/['"]/g, '');
    }
} catch (e) {
    fs.writeFileSync(path.join(__dirname, 'models-output.txt'), "Error reading .env.local: " + e.message);
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
const outputPath = path.join(__dirname, 'models-output.txt');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync(outputPath, `Status: ${res.statusCode}\n\n${data}`);
    });
}).on('error', (e) => {
    fs.writeFileSync(outputPath, "Network Error: " + e.message);
});
