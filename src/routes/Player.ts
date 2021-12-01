import express from "express";
import PlayerController from "@/controllers/PlayerController";
import { playerValidator } from "@/routes/validators/PlayerValidator";
import { errorValidatorMiddleware } from "@/routes/validators/ErrorValidatorMiddleware";

const playerRouter = express.Router();


playerRouter.post('/', playerValidator.createPlayer, errorValidatorMiddleware, async function(req, res, next) {
    const playerController = new PlayerController(req, res, next)
    await playerController.createPlayer()
});

export default playerRouter;
