import  Player  from "@/domain/models/Player";
import jwt from "jsonwebtoken";

export default class SecurityService {

    private static instance: SecurityService;

    static getInstance() {
        if (!SecurityService.instance) {
            SecurityService.instance = new SecurityService();
        }

        return SecurityService.instance;
    }

    generateJwtToken(user: Player): string {
        const payload = {
            sub: user.id,
            iat: new Date().getTime(),
            exp: new Date().getTime() + (60 * 60 * 1000)
        };

        return jwt.sign(payload, process.env.JWT_SECRET);
    }


}
