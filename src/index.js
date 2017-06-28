#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
var args = require('args');
var babel = require("babel-core");

args
    .option('input', 'The file to compile')
    .option('es5', 'compile to es5 instead of es6')
    .option('output', 'output file (if none, lookup stdio)')
    .option('stdio', 'output tp stdio (if none, execute directly without compilation result)', false);

const flags = args.parse(process.argv);


if(!flags.input) {
    console.error("Error no input file (see --help).");
    process.exit(1);
}

const code = fs.readFileSync(path.join(process.cwd(), flags.input), 'utf8');
process.chdir(path.join(process.cwd(), flags.input, '..'));

import Compiler from './compiler';

let result = new Compiler(code).run() + "start();"; 

if(((flags.output || flags.stdio) && flags.es5)) {
    result = babel.transform(result, { "presets": ["es2015"] }).code;
}

if(flags.output) {
    fs.writeFileSync(flags.output, result, 'utf8');
}

else if(flags.stdio) {
    console.log(result);
}

else {
    eval(babel.transform(result, { "presets": ["es2015"] }).code);
}