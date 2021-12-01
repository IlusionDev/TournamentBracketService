import { ProjectEvent } from "@/events/ProjectEvent";

export default class BracketTournamentEvents extends ProjectEvent {

    private static instance: BracketTournamentEvents;
    public static readonly bracketTournamentFinishEvent: string = "bracketTournamentFinish";
    public static readonly bracketTournamentFinishedEvent: string = "bracketTournamentFinished";
    public static readonly bracketTournamentStartEvent: string = "bracketTournamentStart";
    private static events = {
        [BracketTournamentEvents.bracketTournamentFinishEvent]: BracketTournamentEvents.bracketTournamentFinishEvent,
        [BracketTournamentEvents.bracketTournamentFinishedEvent]: BracketTournamentEvents.bracketTournamentFinishedEvent,
        [BracketTournamentEvents.bracketTournamentStartEvent]: BracketTournamentEvents.bracketTournamentStartEvent
    };

    constructor() {
        super(BracketTournamentEvents.events);
    }

    static getInstance() {
        if (!BracketTournamentEvents.instance) {
            BracketTournamentEvents.instance = new BracketTournamentEvents();
        }

        return BracketTournamentEvents.instance;
    }

    tournamentFinish(data: any): void {
        this.emit(BracketTournamentEvents.bracketTournamentFinishEvent, data);
    }

    tournamentFinished(param: { winnerId: string; bracketTournamentId: string }) {
        this.emit(BracketTournamentEvents.bracketTournamentFinishedEvent, param);
    }

    tournamentStart(bracketTournamentId: string) {
        this.emit(BracketTournamentEvents.bracketTournamentStartEvent, bracketTournamentId);
    }
}

