
import ArgumentsStatement from './arguments';
import Compiler from './../compiler';

export default class ExecutionStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/^([a-z][a-z0-9]+)\s+(.*)/) || this.command.match(/^(else)/)) {
            return true;
        }
    }

    run(context) {
        const match = this.command.match(/^([a-z][a-z0-9]+)\s+(.*)/) || this.command.match(/^(else)/);

        if(match) {
            let functionName = match[1];
            let argumentsList = match[2];

            if(functionName == "if") {
                const body = new Compiler(""+this.children).run(Object.assign({}, context));
                return (`${functionName}(${argumentsList}) {${body}}`);
            }

            else if (functionName == "else") {
                const body = new Compiler(""+this.children).run(Object.assign({}, context));
                return (`${functionName} {${body}}`);
            }

            const testBody = new ArgumentsStatement(argumentsList);

            if(testBody.test()) {
                const body = testBody.run(Object.assign({}, context));
                return (`return ${functionName}${body};`);
            }
            else {
                return (`return ${functionName}();`);
            }
        }
    }
}