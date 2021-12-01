import { validationResult } from "express-validator";
import CRequest from "@/global/definitions/CRequest";
import { Response } from "express";

export const errorValidatorMiddleware = (req: CRequest, res: Response, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return req.apiResponse.generateAndSendWithStatus(errors.array(),{
            statusCode: 400,
            error: true
        });
    }
    next();
}
