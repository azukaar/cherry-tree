
import ArgumentsStatement from './arguments';
import Compiler from './../compiler';

export default class ExecutionStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/^([a-z][a-z0-9]+)\s*(.*)\s*\:?/)) {
            return true;
        }
    }

    run(context) {
        const match = this.command.match(/^([a-z][a-z0-9]+)\s*(.*)\s*\:?/);

        if(match) {
            let functionName = match[1];
            let argumentsList = match[2];

            if(functionName == "if") {
                const body = new Compiler(this.children).run(Object.assign({}, context));
                return (`${functionName}${argumentsList} {${body}}`);
            }

            else if (functionName == "else") {
                const body = new Compiler(this.children).run(Object.assign({}, context));
                return (`${functionName} {${body}}`);
            }

            else if(this.children) {
                let body = new Compiler(this.children).run(Object.assign({ isChildren : true }, context));

                if(body.slice(-1) == "+") body = body.slice(0, -1);

                return (`${context.isChildren? '' : '__result += '}${functionName}(${argumentsList ? argumentsList+',' : ''} ${body})`);
            }

            const testArguments = new ArgumentsStatement(argumentsList);

            if(testArguments.test()) {
                const argumentsList = testArguments.run(Object.assign({}, context));
                return (`${context.isChildren? '' : '__result += '}${functionName}${argumentsList}${context.isChildren? '' : ';'}`);
            }
            else {
                return (`${context.isChildren? '' : '__result += '}${functionName}()${context.isChildren? '' : ';'}`);
            }
        }
    }
}