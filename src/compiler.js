const yaml = require('js-yaml');
const chalk = require('chalk');

import statements from './statements.js';

export default class Compiler {

    constructor(code) {
        this.code = (typeof code !== "object" && code.split("\n").length > 1) ?  this.hackToArray(code) : code;
    }

    hackToArray(code) {
        code = code.replace(/^ +\w/gmi, (e) => e.slice(0, -1) + " - " + e.slice(-1))
        return code
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

            if(doc instanceof Array) {
                let lineNumber = lineNumberInit, result = [];

                for (let node in doc)  {
                    lineNumber++;
                    if(node.replace(/\s/g, "") != "") {
                        let compiler = new Compiler(doc[node]);
                        result.push(compiler.run(context));
                    }
                };

                let final = result.shift();
                for(let r in result) {
                    let res = result[r];
                    if(res.match(/^if/) || res.match(/^else/)) {
                        final += result.shift();
                    }
                    else {
                        final += " + " + result.shift();
                    }
                }
                
                return final;
            }
            else if(typeof doc === "object") {
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