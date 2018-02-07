
import Compiler from './../compiler';

export default class FunctionStatement {
    constructor(command, children, target) {
        this.command = command;
        this.children = children;
        this.target = target;
    }

    test() {
        if(this.command.match(/^\s*([A-Z][a-z]+)\s*((?:[a-z][a-zA-Z0-9\=]*\s*,?\s*)*)/)) {
            
            return true;
        }
    }

    run(context = {}) {
        const match = this.command.match(/([A-Z][a-z]+)\s*((?:[a-z][0-9a-zA-Z\=]*\s*,?\s*)*)/);
        
        if(match) {
            let functionName = match[1].replace(/^([A-Z][a-z]+)/, e => e.toLowerCase());
            let funcContext = match[2]
                    .split(",")
                    .filter(e => e != '')
                    .map(e => e.replace(/\s/g, ""))
                    .map(e => {return {"name" : e}});

            let funArg = funcContext.map(e => e.name).join(', ');
            const body = new Compiler(this.children, this.target).run(Object.assign({}, context, funcContext));
            const states = body.match(/this\.[a-zA-Z0-9]+/g);
            const statesArg = states ? states.join(', ') : '';
            const statesArgObj = states ? states.map(e => `"${e.split('this.')[1]}" : JSON.parse(${e})`).join(', ') : '';
            
            if(states && states.length > 0 && funArg.length > 0) funArg += ', '

            // TODO : add hoisting 
            return `"${functionName}'" : (${funArg}) => CherryStem.bind(this)('${functionName}', {${funArg}${statesArgObj}}, () => {let __result = ""; ${body}; return __result;}),`;
        }
    }
}