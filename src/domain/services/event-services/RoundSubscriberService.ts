import Match from "@/domain/models/Match";
import  RoundEvents  from "@/events/RoundEvents";
import Round from "@/domain/models/Round";
import Player from "@/domain/models/Player";
import RoundService from "@/domain/services/RoundService";
import Bracket from "@/domain/models/Bracket";
import MobilePushService from "@/services/MobilePushService";
import BracketTournamentEvents from "@/events/BracketTournamentEvents";
import MatchRepository from "@/domain/repositories/MatchRepository";

export default class RoundSubscriberService {

    async _roundFinished(matches: Match[]) {
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const winner = await match.winner
            if(!winner) {
                return false;
            }
        }

        return true;
    }


    async _createNextRound(bracketTournamet: Bracket, winners: Player[]) {
        const round = await new RoundService()
            .createRoundAndMatches(bracketTournamet, winners);
    }

    async _isLastRoundAndHaveAWinner(matches: Match[]) {
        const winners = []
        for (let i = 0; i < matches.length; i++) {
            const winner = await matches[i].winner;
            if(typeof winner !== 'undefined') winners.push(winner);
        }

        return winners.length === 1;
    }

    async roundMatchUpdated(matchId: string): Promise<void> {
        const matchRepository = MatchRepository.getRepository();
        const roundService = new RoundService();
        const match = await matchRepository.findOne(matchId);
        const round = await match.round;
        const matches = await round.matches;
        const bracket = await round.bracket;
        const isRoundFinished = await this._roundFinished(matches);
        const isLastRoundAndHaveAWinner = await this._isLastRoundAndHaveAWinner(matches);

        if (!isRoundFinished) {
            return
        }

        await roundService.setFinishedRound({ roundId: round.id });

        if (isLastRoundAndHaveAWinner) {
            return BracketTournamentEvents.getInstance().tournamentFinish({
                lastRound: round.id,
                bracketTournamentId: bracket.id
            });
        }

        const winners = []

        for (let i = 0; i < matches.length; i++) {
            const winner = await matches[i].winner
            winners.push(winner)
        }

        const nextRound = await this._createNextRound(bracket, winners);

        RoundEvents.getInstance().roundFinished({
            lastRound: round,
            nextRound: nextRound
        });
    }

    async notifyNextRound(round: Round) {
        const roundService = new RoundService();
        const mobilePushService = MobilePushService.getInstance();
        const allRoundPlayers = await roundService.getAllRoundPlayers(round);

        await mobilePushService.pushToAllPlayerNextRoundNotification(allRoundPlayers);
    }

}
