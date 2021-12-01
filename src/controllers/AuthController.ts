import Controller from "@/controllers/base/controller";
import AuthService from "@/domain/services/AuthService";

export default class AuthController extends Controller {

    login() {
        const userId = this.req.body.userId;
        const securityService = AuthService.getInstance()
        const token = securityService.login(userId);

        return this.req.apiResponse.generateAndSendWithStatus(token);
    }
}
