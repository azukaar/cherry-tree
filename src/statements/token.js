
export default class TokenStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/^[a-z0-9]+$/) || this.command.match(/^\".*\"$/) ) {
            return true;
        }
    }

    run(context) {
         return `return ${this.command};`;
    }
}