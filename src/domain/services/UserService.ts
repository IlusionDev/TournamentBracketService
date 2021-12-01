import Player from "@/domain/models/Player";
import Bcrypt from "bcrypt";
import PlayerRepository from "@/domain/repositories/PlayerRepository";
import { ErrorNotSaved } from "@/global/errors/ErrorNotSaved";
import ErrorApi from "@/global/errors/ErrorApi";

export default class UserService {

    private static instance: UserService;

    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async createPlayer(email: string, password: string): Promise<Player> {
        const playerRepository = new PlayerRepository();

        const preExistingPlayer = await playerRepository.findByEmail(email);

        if (preExistingPlayer) {
            throw new ErrorApi("Player already exists", 409);
        }

        const encryptedPassword = Bcrypt.hashSync(password, 10);

        const player = PlayerRepository.getRepository().create({ email, password: encryptedPassword });

        const playerSaved = await PlayerRepository.getRepository().save(player);

        if (!playerSaved) {
            throw new ErrorNotSaved('Player');
        }

        return player;
    }
}
