
import Compiler from './../compiler';

export default class FunctionStatement {
    constructor(command, children) {
        this.command = command;
        this.children = children;
    }

    test() {
        if(this.command.match(/([A-Z][a-z]+)\s*((?:[a-z][a-zA-Z]*\s*,?\s*)*)/)) {
            
            return true;
        }
    }

    run(context = {}) {
        const match = this.command.match(/([A-Z][a-z]+)\s*((?:[a-z][a-zA-Z]*\s*,?\s*)*)/);
        
        if(match) {
            let functionName = match[1].replace(/^([A-Z][a-z]+)/, e => e.toLowerCase());
            let funcContext = match[2]
                    .split(",")
                    .filter(e => e != '')
                    .map(e => e.replace(/\s/g, ""))
                    .map(e => {return {"name" : e}});

            const body = new Compiler(this.children).run(Object.assign({}, context, funcContext));

            return (`function ${functionName}(${funcContext.map(e => e.name).join(', ')}) {${body}};`);
        }
    }
}