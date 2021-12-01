import { getRepository } from "typeorm";
import Round from "@/domain/models/Round";


export default class RoundRepository {

    static getRepository() {
        return getRepository(Round);
    }
}
