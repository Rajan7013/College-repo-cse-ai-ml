
const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = process.argv[2];
if (!pdfPath) {
    console.error("No PDF path provided");
    process.exit(1);
}

let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    // console.log(data.numpages);
    // console.log(data.info);
    // console.log(data.metadata); 
    // console.log(data.version);
    // console.log(data.text);
    fs.writeFileSync('syllabus_text.txt', data.text);
    console.log('Extraction complete. Saved to syllabus_text.txt');
}).catch(err => {
    console.error("Error:", err);
});
