console.log('Testing require...');
try {
    const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
    console.log('Require success', pdfjs.version);
} catch (e) {
    console.error('Require failed', e);
}
