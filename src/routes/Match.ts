import express from "express";
import MatchController from "@/controllers/MatchController";
import { matchValidator } from "@/routes/validators/MatchValidator";
import { errorValidatorMiddleware } from "@/routes/validators/ErrorValidatorMiddleware";

const matchRouter = express.Router();


matchRouter.post('/stats', matchValidator.saveMatchStats, errorValidatorMiddleware, async function(req, res, next) {
    const matchController = new MatchController(req, res, next)
    await matchController.saveMatchStats()
});

matchRouter.put('/stats', matchValidator.updateMatchStats, errorValidatorMiddleware, async function(req, res, next) {
    const matchController = new MatchController(req, res, next)
    await matchController.updateMatchStats()
});

export default matchRouter;
