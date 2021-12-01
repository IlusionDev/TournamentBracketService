import {EventEmitter} from "events";

export class ProjectEvent extends EventEmitter {

    protected events: { [key: string]: any } = {};

    constructor(events: { [p: string]: string }) {
        super();
        this.events = events;
    }

    subscribe(eventsObject): void {
        for (let event in eventsObject) {
            if (eventsObject.hasOwnProperty(event)) {
                this.on(this.events[event], eventsObject[event]);
            }
        }
    }
}
