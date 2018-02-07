
import ExecutionStatement from './execution';
import StateStatement from './state';

export default class ArgumentsStatement {
    constructor(command, children, target) {
        this.command = command;
        this.children = children;
        this.target = target;
    }

    test() {
        if(this.command.match(/^\(\s*([a-z0-9\>\<\+\-\=\"\s](\s?,?\s?))+/)) {
            return true;
        }
    }

    run(context) {
        const execTest = new ExecutionStatement(this.command, null, this.target);
        const stateTest = new StateStatement(this.command, null, this.target);

        if(execTest.test()) {
            return execTest.run(Object.assign({}, context)).replace(/;$/, ",").replace(/^return /, "");
        }
        else {
            //TEMP REPLACE
            return this.command.replace(/\$/, 'this.');
        }
    }
}