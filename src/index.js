#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
var args = require('args');
var babel = require("babel-core");

import Compiler from './compiler';

const getTarget = (t) => t.match(/^cherry-target\-/) ? t : 'cherry-target-' + t;

export default class CherryTree {
    runFile(input, target = 'node-terminal') {
        const baseCode = `const {Start, CherrySensor, CherryStem, CherryComponent} = require('${getTarget(target)}');\n`;
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

        let result = babel.transform(baseCode + new Compiler(code, require(getTarget(target))).run() + "Start(new Main());", { "presets": ["es2015"] }).code;

        process.chdir(originalDir);
        return result;
    }

    run(code, target = 'node-terminal') {
        const baseCode = `const {Start, CherrySensor, CherryStem, CherryComponent} = require('${getTarget(target)}');\n`;
        return babel.transform(baseCode + new Compiler(code, require(getTarget(target))).run() + "Start(new Main());", { "presets": ["es2015"] }).code;
    }
}