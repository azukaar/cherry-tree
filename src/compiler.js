const yaml = require('js-yaml');
const chalk = require('chalk');

import File from './statements/file.js';
import statements from './statements.js';

export default class Compiler {

    constructor(code, target) {
        this.code = (typeof code !== "object" && code.split("\n").length > 1) ?  this.hackToArray(code) : code;
        this.target = target;
    }

    hackToArray(code) {
        code = code.replace(/^ +[\"\$\w]/gmi, (e) => e.slice(0, -1) + " - " + e.slice(-1))
        code = code.replace(/^#/gmi, (e) => "__SENSOR__")
        return code
    }

    run(context = {lineNumber: 0}) {
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
                let result = [];

                for (let node in doc)  {
                    context.lineNumber++;
                    if(node.replace(/\s/g, "") != "") {
                        let compiler = new Compiler(doc[node], this.target);
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
                let result = '', isRoot = context.lineNumber===0;
                let currentFile = new File();

                for (let node in doc)  {
                    context.lineNumber++;
                    if(node.replace(/\s/g, "") != "") {
                        let s;
                        for (let statement in statements)  {
                            s = new statements[statement](node, doc[node], this.target);
                            if(s.test()) {
                                let compiled = s.run(context);
                                if(s instanceof statements['StateStatement']) {
                                    currentFile.addState(compiled)
                                }
                                else if(s instanceof statements['SensorStatement']) {
                                    currentFile.addSensor(compiled)
                                }
                                else if(s instanceof statements['FunctionStatement']) {
                                    currentFile.addStem(compiled)
                                }
                                else {
                                    result += compiled;
                                }
                                break;
                            }
                        }

                        if(!s.test()) throw new Error(chalk.red("Parse Error line ") + chalk.bold.red(context.lineNumber) + chalk.red(". Unrecognized statement : ") + chalk.red.bold(node.replace('__STATE__', '@').replace('__SENSOR__', '#')))
                    }
                };

                return result + (isRoot ? currentFile.render() : '');
            }
            else {
                let s;
                let node = this.code;
                let result = '';
                
                for (let statement in statements)  {
                    s = new statements[statement](node, doc[node], this.target);
                    if(s.test()) {
                        let r = s.run(context);
                        result += r;
                        break;
                    }
                }

                if(!s.test()) throw new Error(chalk.red("Parse Error line ") + chalk.bold.red(context.lineNumber) + chalk.red(". Unrecognized statement : ") + chalk.red.bold(node.replace('__STATE__', '@').replace('__SENSOR__', '#')))
                
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