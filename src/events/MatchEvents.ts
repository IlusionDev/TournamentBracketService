import { ProjectEvent } from "@/events/ProjectEvent";
import MatchStats from "@/domain/models/MatchStats";

export default class MatchEvents extends ProjectEvent {

    private static instance: MatchEvents;
    public static readonly finishedEvent: string = "matchFinished";
    public static readonly statsUpdatedEvent: string = "matchStatsUpdated";
    public static readonly createTiedBreakerEvent: string = "createTiedBreaker";
    private static events = {
        [MatchEvents.finishedEvent]: MatchEvents.finishedEvent,
        [MatchEvents.statsUpdatedEvent]: MatchEvents.statsUpdatedEvent,
        [MatchEvents.createTiedBreakerEvent]: MatchEvents.createTiedBreakerEvent
    };

    constructor() {
        super(MatchEvents.events);
    }

    static getInstance() {
        if (!MatchEvents.instance) {
            MatchEvents.instance = new MatchEvents();
        }

        return MatchEvents.instance;
    }

    public finished(roundId: any): void {
        this.emit(MatchEvents.finishedEvent, roundId);
    }

    public statsUpdated(roundId: any): void {
        this.emit(MatchEvents.statsUpdatedEvent, roundId);
    }

    public createTieBreaker(roundId: string, playerIds: string[]): void {
        this.emit(MatchEvents.createTiedBreakerEvent, roundId, playerIds);
    }
}

