
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText(pdfPath) {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument(data);
    const pdfDocument = await loadingTask.promise;

    let fullText = '';
    // Limit to first 50 pages or specific range if we know it?
    // User said "1 to 4 years", so it's likely sorted.
    // Let's read pages 1 to 50 first to find Year 1 Sem 1 and Sem 2.
    const numPages = Math.min(pdfDocument.numPages, 30);

    console.log(`Processing ${numPages} pages...`);

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
    }

    // console.log(fullText);
    // Write to a file so the agent can read it
    fs.writeFileSync('syllabus_text.txt', fullText);
    console.log('Extraction complete. Text saved to syllabus_text.txt');
}

const pdfPath = process.argv[2];
if (!pdfPath) {
    console.error('Please provide PDF path');
    process.exit(1);
}

extractText(pdfPath);
