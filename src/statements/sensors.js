
import Compiler from './../compiler';

export default class FunctionStatement {
    constructor(command, children, target) {
        this.command = command;
        this.children = children;
        this.target = target;
    }

    test() {
        if(this.command.match(/__SENSOR__\s*?([a-zA-Z0-9\=\|\\\#\.\s])+/)) {
            return true;
        }
    }

    run(context = {}) {
        const match = this.command.match(/__SENSOR__\s*?([a-zA-Z0-9\=\|\\\#\.\s]+)/);
        let regexAssociated = match[1];
        
        const body = new Compiler(this.children, this.target).run(Object.assign({}, context));

        if(match) {
            return `new CherrySensor(/${regexAssociated.replace(/ /, '')}/, (event) => {${body}; Start(this)}),`;
        }
    }
}