
import Compiler from './../compiler';

export default class FunctionStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/__SENSOR__\s*?([a-zA-Z0-9\=\|\\\#\.\s])+/)) {
            return true;
        }
    }

    run(context = {}) {
        const match = this.command.match(/__SENSOR__\s*?([a-zA-Z0-9\=\|\\\#\.\s]+)/);
        console.log(match)
        let regexAssociated = match[1];
        
        const body = new Compiler(this.children).run(Object.assign({}, context));

        if(match) {
            return `cherry__addSensor(/${regexAssociated.replace(/ /, '')}/, function {let __result = ""; ${body}; return __result; })`;
        }
    }
}