import SecurityService from "@/domain/services/SecurityService";
import Player from "@/domain/models/Player";

export default class AuthService {

    private static instance: AuthService;

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    login(user: Player) {
        const securityService = SecurityService.getInstance()

        return securityService.generateJwtToken(user)
    }
}
