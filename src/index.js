#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
var args = require('args');
var babel = require("babel-core");
import Compiler from './compiler';

export default class CherryTree {
    runFile(input) {
        const originalDir = process.cwd();
        let code;
        if(path.isAbsolute(input)) {
            code = fs.readFileSync(input, 'utf8');
            process.chdir(path.join(input, '..'));
        }
        else {  
            code = fs.readFileSync(path.join(process.cwd(), input), 'utf8');
            process.chdir(path.join(process.cwd(), input, '..'));
        }

        let result = new Compiler(code).run() + "start();";

        return result;
        process.chdir(originalDir);
    }
}