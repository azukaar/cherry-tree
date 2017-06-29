#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
var args = require('args');
var babel = require("babel-core");
import Compiler from './compiler';

export default class CherryTree {
    runFile(input) {
        const code = fs.readFileSync(path.join(process.cwd(), input), 'utf8');
        process.chdir(path.join(process.cwd(), input, '..'));

        let result = new Compiler(code).run() + "start();"; 

        eval(babel.transform(result, { "presets": ["es2015"] }).code);
    }
}