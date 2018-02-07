const isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default class StateStatement {
    constructor(command, children, target) {
        this.command = command;
        this.children = children;
        this.target = target;
    }

    test() {
        if(this.command.match(/^\$[a-zA-Z0-9]+/)) {
            return true;
        }
    }

    run(context) {
        if(this.children)
            return `${this.command.replace(/^\$/, 'this.')} = \`${this.children.replace(/^\$/, 'this.')}\`;`;
        else {
            return `${this.command.replace(/^\$/, 'this.')};`;
        }
    }
}