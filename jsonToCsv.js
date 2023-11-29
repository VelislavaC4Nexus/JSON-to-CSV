const fs = require('fs');

const input = fs.readFileSync("./input.json", 'utf-8');
const jsonData = JSON.parse(input);
const headers = Object.keys(jsonData[0]);
const csvHeaders = headers.join(',');

const csvContent = jsonData.map(row => headers.map(header => row[header])).join(',');

const result  =[csvHeaders,csvContent].join('\n');
fs.writeFileSync('output.csv', result, 'utf8');




