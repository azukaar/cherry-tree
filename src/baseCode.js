let cherry__sensorsList = [];

const cherry__addSensor = function cherry__addSensor(regex, listener) {
    cherry__sensorsList[regex] = listener;
};

const cherry__fire = function cherry__fire(event, eventArg) {
    for(s in cherry__sensorsList) {
        let sensor = cherry__sensorsList[s];
        if(event.match(s)) {
            sensor();
        }
    }
};