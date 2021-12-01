import { getRepository, Repository } from "typeorm";
import Match from "@/domain/models/Match";


export default class MatchRepository {
    static getRepository() {
        return getRepository(Match);
    }
}
