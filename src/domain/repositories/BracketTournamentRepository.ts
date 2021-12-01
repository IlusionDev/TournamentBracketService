import { getRepository, Repository } from "typeorm";
import Bracket from "@/domain/models/Bracket";


export default class BracketTournamentRepository {


    static getRepository() {
        return getRepository(Bracket);
    }

    getBracketPlayerById(playerId: string, bracketId: string) {
        return getRepository(Bracket).createQueryBuilder("bracket")
            .leftJoinAndSelect("bracket.players", "player")
            .where("bracket.id = :bracketId", { bracketId })
            .andWhere("player.id = :playerId", { playerId })
            .getOne();
    }


}
