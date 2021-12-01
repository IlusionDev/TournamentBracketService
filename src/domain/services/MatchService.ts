import Match from "@/domain/models/Match";
import { ErrorNotSaved } from "@/global/errors/ErrorNotSaved";
import { CreateMatchDto } from "@/domain/definitions/dto/CreateMatchDto";
import MatchRepository from "@/domain/repositories/MatchRepository";
import PlayerRepository from "@/domain/repositories/PlayerRepository";
import RoundRepository from "@/domain/repositories/RoundRepository";
import Round from "@/domain/models/Round";
import Player from "@/domain/models/Player";

export default class MatchService {

    async createMatchAndMatchPlayers(matchDto: CreateMatchDto): Promise<Match> {
        const matchRepository = MatchRepository.getRepository();
        const roundRepository = RoundRepository.getRepository();
        const playerRepository = PlayerRepository.getRepository();
        const round: Round = await roundRepository.findOne(matchDto.roundId);
        const players: Player[] = await playerRepository.findByIds(matchDto.playerIds);

        if (!round || players.length !== matchDto.playerIds.length) {
            throw new Error('Invalid round or players');
        }
        const newMatch: Match = matchRepository.create({
            round: round,
            players: players,
            winner: null,
        } as any) as unknown as Match;

        const savedMatch = await matchRepository.save(newMatch);

        if (!savedMatch) {
            throw new ErrorNotSaved('Match');
        }

        return savedMatch;
    }

    async setMatchWinner(matchId: number, winnerId: number): Promise<Match> {
        const matchRepository = MatchRepository.getRepository();
        const playerRepository = PlayerRepository.getRepository();
        const match: Match = await matchRepository.findOne(matchId);
        const winner: Player = await playerRepository.findOne(winnerId);

        if (!match || !winner) {
            throw new Error('Invalid match or player');
        }

        match.winner = winner as unknown as Promise<Player>;

        const savedMatch = await matchRepository.save(match);

        if (!savedMatch) {
            throw new Error('Match not saved');
        }

        return savedMatch;
    }

}
