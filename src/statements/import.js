const child_process = require('child_process');
const fs   = require('fs');
const path = require('path');

import Compiler from './../compiler';

export default class ImportStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/^import .*/)) {
            
            return true;
        }
    }

    run() {
        const match = this.command.match(/^import (.+)/);
        if(match) {
            const fileName = match[1];
            return `import {${this.children.split(" ").join(",")}} from 'cherry-module-${fileName}';`;
        }
        else {

        }
    }
}