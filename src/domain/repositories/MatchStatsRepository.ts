import { getRepository, Repository } from "typeorm";
import MatchStats  from "@/domain/models/MatchStats";


export default class MatchStatsRepository {


    static getRepository() {
        return getRepository(MatchStats);
    }

    async getAllMatchStatsByMatch(matchId: string, playersId: string[]) {
        return await getRepository(MatchStats).createQueryBuilder("matchStats")
            .where("matchStats.match_id = :matchId", { matchId })
            .andWhere("matchStats.player_id IN (:...playersId)", { playersId })
            .getMany();
    }
}
