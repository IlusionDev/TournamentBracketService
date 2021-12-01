import {NextFunction, Response} from "express";
import ApiResponseService from "@/domain/services/ApiResponseService";
import CRequest from "@/global/definitions/CRequest";

export default function (req: CRequest, res: Response, next: NextFunction) {
    req.apiResponse = ApiResponseService.getInstance(req, res)
    next()
}
