import MatchStats from "@/domain/models/MatchStats";
import { ErrorNotUpdated } from "@/global/errors/ErrorNotUpdated";
import RoundEvents from "@/events/RoundEvents";
import MatchEvents from "@/events/MatchEvents";
import MatchRepository from "@/domain/repositories/MatchRepository";
import MatchStatsRepository from "@/domain/repositories/MatchStatsRepository";
import Match from "@/domain/models/Match";
import Player from "@/domain/models/Player";
import MatchService from "@/domain/services/MatchService";
import MobilePushService from "@/services/MobilePushService";

export default class MatchSubscriberService {

    async matchFinished(matchId: string) {
        RoundEvents.getInstance().roundMatchUpdated(matchId);
    }

    allStatsFinished(allStats: MatchStats[]) {
        return allStats.every(stats => stats.finished);
    }

    _haveTiedStats(matchStats: MatchStats[]) {
        const tiedMatchs = matchStats.filter(stats => stats.points === matchStats[0].points)

        return tiedMatchs.length > 1 ? tiedMatchs : false;
    }

    _sortStatsByPoints(matchStats: MatchStats[]) {
        return matchStats.sort((a, b) => b.points - a.points);
    }

    async selectMatchWinner(matchStats: MatchStats[]) {
        return await this._sortStatsByPoints(matchStats)[0].player;
    }

    async statsUpdated(matchId: string) {
        const matchRepository = MatchRepository.getRepository();
        const matchStatsRepository = new MatchStatsRepository();
        const match: Match = await matchRepository.findOne(matchId);
        const matchPlayers = await match.players;
        const matchPlayersIds = matchPlayers.map(player => player.id);
        const allPlayerStats: MatchStats[] = await matchStatsRepository.getAllMatchStatsByMatch(matchId, matchPlayersIds)

        if (allPlayerStats.length !== matchPlayers.length) {
            return
        }
        const areAllStatsFinished = this.allStatsFinished(allPlayerStats);

        if (!areAllStatsFinished) {
            return;
        }

        const tiedStats = this._haveTiedStats(this._sortStatsByPoints(allPlayerStats));

        if(tiedStats) {
            const round = await match.round;
            const tiePlayers = tiedStats.map(async stats => await stats.player);
            const tieplayersResolved = await Promise.all(tiePlayers);
            MatchEvents.getInstance().createTieBreaker(round.id, tieplayersResolved.map(player => player.id));
            return;
        }

        const winner = await this.selectMatchWinner(allPlayerStats);
        match.winner = winner as unknown as Promise<Player>;

        const updatedMatch = await matchRepository.save(match);

        if (!updatedMatch) {
            throw new ErrorNotUpdated('Match');
        }

        MatchEvents.getInstance().finished(match.id);
    }

    async createTiedBreakerMatch(roundId: string, playerIds: string[] ) {
       const matchService = new MatchService();
       const match = await matchService.createMatchAndMatchPlayers({
           roundId,
           playerIds
       });
       MobilePushService.sendPushNotification("Tie Breaker", `${playerIds.length} players tied in round ${roundId}`, match.id);
    }

}
