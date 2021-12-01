import express from "express";
import { BracketController } from "@/controllers/BracketController";
import { bracketValidator } from "@/routes/validators/BracketValidator";
import { errorValidatorMiddleware } from "@/routes/validators/ErrorValidatorMiddleware";

const bracketRouter = express.Router();


bracketRouter.post('/', bracketValidator.create, errorValidatorMiddleware, async function(req, res, next) {
    const bracketController = new BracketController(req, res, next)
    await bracketController.createBracket()
});

bracketRouter.get('/', async function(req, res, next) {
    const bracketController = new BracketController(req, res, next)
    await bracketController.getAllBrackets()
});

bracketRouter.post('/enter', bracketValidator.newBracketPlayerParticipant, errorValidatorMiddleware, async function(req, res, next) {
    const bracketController = new BracketController(req, res, next)
    await bracketController.newBracketPlayerParticipant()
});

bracketRouter.post('/start', bracketValidator.bracketStart, errorValidatorMiddleware, async function(req, res, next) {
    const bracketController = new BracketController(req, res, next)
    await bracketController.bracketStart()
});

export default bracketRouter;
