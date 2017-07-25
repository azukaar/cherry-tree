const isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default class TokenStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/^[a-z0-9]+$/) || this.command.match(/^\".*\"$/)  || isNumeric(this.command) ) {
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