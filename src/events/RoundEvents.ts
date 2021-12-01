import { ProjectEvent } from "@/events/ProjectEvent";

export default class RoundEvents extends ProjectEvent {

    private static instance: RoundEvents;
    public static readonly finishEvent: string = "roundFinish";
    public static readonly roundMatchUpdatedEvent: string = "roundMatchUpdated";
    private static events = {
        [RoundEvents.finishEvent]: RoundEvents.finishEvent,
        [RoundEvents.roundMatchUpdatedEvent]: RoundEvents.roundMatchUpdatedEvent
    };

    constructor() {
        super(RoundEvents.events);
    }

    static getInstance() {
        if (!RoundEvents.instance) {
            RoundEvents.instance = new RoundEvents();
        }

        return RoundEvents.instance;
    }

    public roundMatchUpdated(matchId: string): void {
        this.emit(RoundEvents.roundMatchUpdatedEvent, matchId);
    }

    public roundFinished(data: any): void {
        this.emit(RoundEvents.finishEvent, data);
    }

}

