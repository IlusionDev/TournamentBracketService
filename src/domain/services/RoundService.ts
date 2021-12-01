import Round from "@/domain/models/Round";
import Bracket from "@/domain/models/Bracket";
import { ErrorNotSaved } from "@/global/errors/ErrorNotSaved";
import Player from "@/domain/models/Player";
import MatchService  from "@/domain/services/MatchService";
import { CreateRoundDto } from "@/domain/definitions/dto/CreateRoundDto";
import { SetFinishedRoundDto } from "@/domain/definitions/dto/SetFinishedRoundDto";
import BracketTournamentRepository from "@/domain/repositories/BracketTournamentRepository";
import RoundRepository from "@/domain/repositories/RoundRepository";

export default class RoundService {

    async createRound(createRoundServiceDto: CreateRoundDto): Promise<Round> {
        const bracketTournamentRepository = BracketTournamentRepository.getRepository();
        const roundRepository = RoundRepository.getRepository();
        const bracketTournament = await bracketTournamentRepository.findOne({
            where: {
                id: createRoundServiceDto.bracketId
            }
        });

        const round = roundRepository.create({
            finished: false,
            bracket: bracketTournament,
        } as any);

        const savedRound = await roundRepository.save(round) as unknown as Round;

        if (!savedRound) {
            throw new Error('Round not created');
        }

        return savedRound;
    }

    async setFinishedRound(setFinishedRoundServiceDto: SetFinishedRoundDto): Promise<Round> {
        const roundRepository = RoundRepository.getRepository();
        const round = await roundRepository.findOne({
            where: {
                id: setFinishedRoundServiceDto.roundId
            }
        });

        round.finished = true;

        const savedRound = await roundRepository.save(round);

        if (!savedRound) {
            throw new Error('Round not updated');
        }

        return savedRound;
    }

    async _createNextRoundMatches(size: number, round: Round, players: Player[]) {
        const matches = [];
        const canSplitMatches = players.length % size
        const avaibleMatches = players.length / size;
        if (canSplitMatches !== 0) {
            throw new Error('Not enough players');
        }

        const matchService = new MatchService();
        for (let i = 0; i < avaibleMatches; i++) {
            const nextPlayers = players.slice(i * size, (i + 1) * size);
            const newMatch = await matchService.createMatchAndMatchPlayers({
                roundId: round.id,
                playerIds: nextPlayers.map(player => player.id)
            });
            matches.push(newMatch);
        }

        return matches;
    }

    async createRoundAndMatches(bracketTournamet: Bracket, winners: Player[]) {
        const roundService = new RoundService();
        const round = await roundService.createRound({
            bracketId: bracketTournamet.id,
        });

        if (!round) {
            throw new ErrorNotSaved('Round');
        }

        const matches = await this._createNextRoundMatches(bracketTournamet.matchSize, round, winners);

        if (!matches) {
            throw new ErrorNotSaved('Matches');
        }
    }

    async getAllRoundPlayers(round: Round): Promise<Player[]> {
        const matches = await round.matches;

        return matches.map(match => match.players).reduce((acc, curr) => acc.concat(curr), []);
    }

}
