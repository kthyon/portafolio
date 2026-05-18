const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'C:\\Users\\Ohm\\Downloads\\curriculum-en.pdf';
let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error) {
    console.error("Error reading PDF:", error);
});
