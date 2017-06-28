const yaml = require('js-yaml');
const chalk = require('chalk');

import statements from './statements.js';

export default class Compiler {

    constructor(code) {
        this.code = code;
    }

    run(context = {}, lineNumberInit = 0) {
        // Get document, or throw exception on error
        try {
            var doc;

            if(typeof this.code !== "object") {
                doc = yaml.load(this.code);
            }
            else {
                doc = this.code;
            }

            if(typeof doc === "object") {
                let lineNumber = lineNumberInit, result = '';

                for (let node in doc)  {
                    lineNumber++;
                    if(node.replace(/\s/g, "") != "") {
                        let s;
                        for (let statement in statements)  {
                            s = new statements[statement](node, doc[node]);
                            if(s.test()) {
                                result += s.run(context);
                                break;
                            }
                        }

                        if(!s.test()) throw new Error(chalk.red("Parse Error line ") + chalk.bold.red(lineNumber) + chalk.red(". Unrecognized statement : ") + chalk.red.bold(node))
                    }
                };

                return result;
            }
            else {
                let s;
                let node = this.code;
                let result = '';
                
                for (let statement in statements)  {
                    s = new statements[statement](node, doc[node]);
                    if(s.test()) {
                        result += s.run(context);
                        break;
                    }
                }

                if(!s.test()) throw new Error(chalk.red("Parse Error line ") + chalk.bold.red(lineNumberInit) + chalk.red(". Unrecognized statement : ") + chalk.red.bold(node))
                
                return result;
            }
        } catch (e) {
            if(e.noTrace) {
                console.error(e.message);
            }
            else {
                console.error(e);
            }
        }
    }
}