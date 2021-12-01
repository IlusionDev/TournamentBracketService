import MatchStats from "@/domain/models/MatchStats";
import Match from "@/domain/models/Match";
import Player from "@/domain/models/Player";
import { ErrorNotFound } from "@/global/errors/ErrorNotFound";
import { ErrorNotUpdated } from "@/global/errors/ErrorNotUpdated";
import { ErrorNotSaved } from "@/global/errors/ErrorNotSaved";
import MatchEvents from "@/events/MatchEvents";
import { SaveMatchStatsDto } from "@/domain/definitions/dto/SaveMatchStatsDto";
import { UpdateMatchStatsDto } from "@/domain/definitions/dto/UpdateMatchStatsDto";
import MatchRepository from "@/domain/repositories/MatchRepository";
import PlayerRepository from "@/domain/repositories/PlayerRepository";
import MatchStatsRepository from "@/domain/repositories/MatchStatsRepository";

export class MatchStatsService {

    async _haveMatchStatsInMatch(player: Player, match: Match) {
        const matchStatsRepository = MatchStatsRepository.getRepository();

        const matchStats = await matchStatsRepository.findOne({
            where: {
                player,
                match
            }
        });

        return matchStats !== undefined;
    }

    async _createMatchStatsConditions(player: Player, match: Match) {
        if (!match) {
            throw new ErrorNotFound('Match');
        }

        if (!player) {
            throw new ErrorNotFound('Player');
        }

        const haveMatchStatsInBracket = await this._haveMatchStatsInMatch(player, match);

        if (haveMatchStatsInBracket) {
            throw new ErrorNotSaved("Match stats already exists");
        }
    }

    async saveMatchStats(saveMatchStatsDto: SaveMatchStatsDto) {
        const matchRepository = MatchRepository.getRepository();
        const playerRepository = PlayerRepository.getRepository();
        const matchStatsRepository = MatchStatsRepository.getRepository();

        const match: Match = await matchRepository.findOne(saveMatchStatsDto.matchId);
        const player: Player = await playerRepository.findOne(saveMatchStatsDto.playerId);

        await this._createMatchStatsConditions(player, match);

        const newMatchStats = matchStatsRepository.create({
            match,
            points: saveMatchStatsDto.points,
            player
        } as any);

        const savedMatchStats = await matchStatsRepository.save(newMatchStats);

        if (!savedMatchStats) {
            throw new ErrorNotSaved('MatchStats');
        }

        return savedMatchStats
    }

    async updateMatchStats(updateMatchStatsDto: UpdateMatchStatsDto) {
        const matchStatsRepository = MatchStatsRepository.getRepository();
        const matchStats: MatchStats = await matchStatsRepository.findOne(updateMatchStatsDto.id);

        if (!matchStats) {
            throw new ErrorNotFound('MatchStats');
        }
        const match = await matchStats.match
        const round = await match.round

        if (round.finished) {
            throw new ErrorNotUpdated('Match round already finished')
        }

        if (!!updateMatchStatsDto.finished) {
            matchStats.finished = true;
        } else if (updateMatchStatsDto.points) {
            matchStats.points += updateMatchStatsDto.points;
        }

        const updatedMatchStats = await matchStatsRepository.save(matchStats);

        if (!updatedMatchStats) {
            throw new ErrorNotUpdated('MatchStats');
        }

        MatchEvents.getInstance().statsUpdated(match.id);

        return updatedMatchStats;
    }

    async getMatchStats(matchStatsId: number) {
        const matchStatsRepository = MatchStatsRepository.getRepository();
        const matchStats: MatchStats = await matchStatsRepository.findOne(matchStatsId);

        if (!matchStats) {
            throw new ErrorNotFound('MatchStats');
        }

        return matchStats;
    }

    async getAllMatchStatusByPlayer(playerId: number) {
        const matchStatsRepository = MatchStatsRepository.getRepository();
        const matchStats: MatchStats[] = await matchStatsRepository.find({
            where: {
                player: {
                    id: playerId
                }
            }
        });

        if (!matchStats) {
            throw new ErrorNotFound('MatchStats');
        }

        return matchStats;
    }

}
