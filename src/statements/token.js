const isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default class TokenStatement {
    constructor(command, children, target) {
        this.command = command;
        this.children = children;
        this.target = target;
    }

    test() {
        if(this.command.match(/^\".*\"$/) ) {
            this.command.replace(/^"/, '`')
            this.command.replace(/"$/, '`')
            return true
        }
        if(this.command.match(/^[a-z0-9]+$/) || isNumeric(this.command) ) {
            return true;
        }
    }

    run(context) {
        if(isNumeric(this.command)) {
            return `__result += ${this.command+""};`;
        }
        else {
            return `__result += ${this.command};`;
        }
    }
}