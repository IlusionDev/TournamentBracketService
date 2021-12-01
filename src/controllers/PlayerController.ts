import Controller from "@/controllers/base/controller";
import UserService from "@/domain/services/UserService";
import ErrorApi from "@/global/errors/ErrorApi";

export default class PlayerController extends Controller {

   async createPlayer() {
        const { email, password } = this.req.body;
        const userService = UserService.getInstance();

        try {
            const user = await userService.createPlayer(email, password);

            if (user) {
                return this.req.apiResponse.generateAndSendWithStatus(user, {
                    statusCode: 201,
                    message: "Player created successfully"
                });
            } else {
                return this.req.apiResponse.generateAndSendErrorReponse(new ErrorApi("Player already exists", 409));
            }
        } catch (e) {
            return this.req.apiResponse.generateAndSendErrorReponse(e);
        }

    }
}
