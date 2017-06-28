
import ExecutionStatement from './execution';

export default class ArgumentsStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/^([a-z0-9\>\s](\s?,?\s?))+/)) {
            return true;
        }
    }

    run(context) {
        const execTest = new ExecutionStatement(this.command);

        if(execTest.test()) {
            return execTest.run(Object.assign({}, context)).replace(/;$/, ",").replace(/^return /, "");
        }
        else {
            return this.command;
        }
    }
}