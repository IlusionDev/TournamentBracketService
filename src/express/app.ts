import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { winstonMiddleware } from "@/config/winston";
import cors from 'cors'
import passport from '@/config/passport'
import ApiResponseService from "@/domain/services/ApiResponseService";
import CRequest from "@/global/definitions/CRequest";
import ApiReponseMiddleware from "@/express/ApiReponseMiddleware";
import bracketRouter from "@/routes/Bracket";
import playerRouter from "@/routes/Player";
import matchRouter from "@/routes/Match";

const app = express();

// Cors setup for allow external api calls
app.use(cors());
app.use(ApiReponseMiddleware);
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(winstonMiddleware);
app.use('/bracket', bracketRouter)
app.use('/player', playerRouter)
app.use('/match', matchRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    const apiResponse = new ApiResponseService(req as CRequest, res);
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "dev" ? err : {};
    apiResponse.generateAndSendErrorReponse(err, {
        message: err.message,
        statusCode: 500,
    });
});

export default app;
