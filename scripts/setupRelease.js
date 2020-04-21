const fs = require('fs');

const source = fs.readFileSync(`${__dirname}/package.json`).toString('utf-8');
const sourceObj = JSON.parse(source);
delete sourceObj.scripts;
delete sourceObj.devDependencies;
delete sourceObj.config;
fs.writeFileSync(`${__dirname}/build/package.json`, Buffer.from(JSON.stringify(sourceObj, null, 2), 'utf-8'));
