import { getRepository, Repository } from "typeorm";
import Player from "@/domain/models/Player";


export default class PlayerRepository {


    static getRepository() {
        return getRepository(Player);
    }

    findByEmail(email: string) {
        return getRepository(Player).findOne({ where: { email } });
    }

}
