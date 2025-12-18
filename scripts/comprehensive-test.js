const { GoogleGenerativeAI } = require("@google/generative-ai");
const https = require('https');
const fs = require('fs');
const path = require('path');

// Read API Key
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim().replace(/['"]/g, '') : null;

if (!apiKey) {
    console.log("ERROR: No API key found");
    process.exit(1);
}

const outputFile = path.join(__dirname, 'test-results.txt');
let results = [];

function log(msg) {
    console.log(msg);
    results.push(msg);
}

// Test 1: List Available Models
async function listModels() {
    return new Promise((resolve) => {
        log("\n=== STEP 1: Listing Available Models ===");
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.models) {
                        const flashModels = json.models
                            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                            .filter(m => m.name.toLowerCase().includes('flash') || m.name.toLowerCase().includes('pro'))
                            .map(m => m.name.replace('models/', ''));

                        log(`Found ${flashModels.length} usable models:`);
                        flashModels.forEach(name => log(`  - ${name}`));
                        resolve(flashModels);
                    } else {
                        log("ERROR: " + JSON.stringify(json));
                        resolve([]);
                    }
                } catch (e) {
                    log("Parse Error: " + e.message);
                    resolve([]);
                }
            });
        }).on('error', (e) => {
            log("Network Error: " + e.message);
            resolve([]);
        });
    });
}

// Test 2: Try generating with each model
async function testGeneration(modelName) {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'OK' if you can read this");
        const response = await result.response;
        const text = response.text();
        return { success: true, text: text.substring(0, 50) };
    } catch (e) {
        return { success: false, error: e.message.split('\n')[0] };
    }
}

async function run() {
    log("Testing Gemini API Connection");
    log("API Key: " + apiKey.substring(0, 8) + "..." + apiKey.substring(apiKey.length - 4));

    // Get available models
    const availableModels = await listModels();

    // Test common model names
    log("\n=== STEP 2: Testing Model Generation ===");
    const modelsToTest = [
        ...availableModels,
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    const uniqueModels = [...new Set(modelsToTest)];

    for (const modelName of uniqueModels) {
        log(`\nTesting: ${modelName}`);
        const result = await testGeneration(modelName);
        if (result.success) {
            log(`  ✓ SUCCESS! Response: ${result.text}`);
            log(`\n🎉 WORKING MODEL FOUND: ${modelName}`);
            fs.writeFileSync(path.join(__dirname, 'working-model.txt'), modelName);
            break;
        } else {
            log(`  ✗ Failed: ${result.error}`);
        }
    }

    // Write results
    fs.writeFileSync(outputFile, results.join('\n'));
    log(`\nResults written to: test-results.txt`);
}

run().catch(e => {
    log("Fatal error: " + e.message);
    fs.writeFileSync(outputFile, results.join('\n'));
});
