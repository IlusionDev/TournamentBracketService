import BracketTournamentEvents from "@/events/BracketTournamentEvents";
import BracketTournamentRepository  from "@/domain/repositories/BracketTournamentRepository";
import RoundRepository  from "@/domain/repositories/RoundRepository";
import Bracket from "@/domain/models/Bracket";
import RoundService  from "@/domain/services/RoundService";
import ErrorApi from "@/global/errors/ErrorApi";
import Player from "@/domain/models/Player";

export default class BracketTournamentSubscriberService {

    async tournamentFinish({
                               lastRound,
                               bracketTournamentId,
                           }) {
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        const roundRepository = RoundRepository.getRepository();
        const bracketTornament: Bracket = await bracketTournamentRepository.findOne(bracketTournamentId);
        const round = await roundRepository.findOne(lastRound);
        const matches = await round.matches;

        bracketTornament.winner = await matches[0].winner;
        bracketTornament.finished = true

        await bracketTournamentRepository.save(bracketTornament);

         BracketTournamentEvents.getInstance().tournamentFinished({
            bracketTournamentId,
            winnerId: bracketTornament.winner.id,
        })
    }

   _canStartTournament(bracketTournament: Bracket, players: Player[]) {
        if (bracketTournament.finished || bracketTournament.started) {
            throw new Error("Tournament already started or finished");
        }
       const canSplitMatches = players.length % bracketTournament.matchSize
       if (canSplitMatches !== 0) {
           throw new Error('Not enough players');
       }
    }

    async startBracketTournament(bracketTournamentId: string) {
        const roundService = new RoundService();
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        const bracket = await bracketTournamentRepository.findOne(bracketTournamentId);
        const players = await bracket.players

        this._canStartTournament(bracket, players);

        bracket.started = true;
        await bracketTournamentRepository.save(bracket);
        await roundService.createRoundAndMatches(bracket, players)
    }

}
