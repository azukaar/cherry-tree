
export default class File {
    constructor(target) {
        this.target = target;
        this.sensors = '';
        this.stems = '';
        this.states = '';
    }

    addState(element) {
        this.states += element;
    }

    addSensor(element) {
        this.sensors += element;
    }

    addStem(element) {
        this.stems += element;
    }

    render() {
        return `
export default class Main extends CherryComponent {
    constructor() {
        super(
            // stems
            {
                ${this.stems}
            }, 
            // sensors
            [
                ${this.sensors}
            ], 
        );

        // states

        ${this.states}
}


};\n
`;
    }
}