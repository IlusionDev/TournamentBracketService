import MatchEvents from "@/events/MatchEvents";
import RoundEvents from "@/events/RoundEvents";
import MatchSubscriberService from "@/domain/services/event-services/MatchSubscriberService";
import RoundSubscriberService from "@/domain/services/event-services/RoundSubscriberService";
import BracketTournamentEvents from "@/events/BracketTournamentEvents";
import BracketTournamentSubscriberService from "@/domain/services/event-services/BracketTournamentSubscriberService";

export function loadSubscribers() {
    MatchEvents.getInstance().subscribe({
        [MatchEvents.statsUpdatedEvent]: (args: any) => new MatchSubscriberService().statsUpdated(args),
        [MatchEvents.finishedEvent]:  new MatchSubscriberService().matchFinished,
        // @ts-ignore
        [MatchEvents.createTiedBreakerEvent]:  (...args) => new MatchSubscriberService().createTiedBreakerMatch(...args),
    });
    RoundEvents.getInstance().subscribe({
        [RoundEvents.roundMatchUpdatedEvent]: (args: any) => new RoundSubscriberService().roundMatchUpdated(args),
        [RoundEvents.finishEvent]: new RoundSubscriberService().notifyNextRound
    });
    BracketTournamentEvents.getInstance().subscribe({
        [BracketTournamentEvents.bracketTournamentStartEvent]: new BracketTournamentSubscriberService().startBracketTournament,
        [BracketTournamentEvents.bracketTournamentFinishEvent]: new BracketTournamentSubscriberService().tournamentFinish,
    });
}
