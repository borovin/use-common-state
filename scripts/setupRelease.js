const fs = require('fs');

const cwd = process.cwd();

const source = fs.readFileSync(`${cwd}/package.json`).toString('utf-8');
const sourceObj = JSON.parse(source);
delete sourceObj.scripts;
delete sourceObj.devDependencies;
delete sourceObj.config;
fs.writeFileSync(`${cwd}/build/package.json`, Buffer.from(JSON.stringify(sourceObj, null, 2), 'utf-8'));
