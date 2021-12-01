import { Response } from "express-serve-static-core";
import winston from "winston";
import CRequest from "@/global/definitions/CRequest";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "daily-trends" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

if (process.env.NODE_ENV !== "prod") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export function winstonMiddleware(
    req: CRequest,
    res: Response,
    next: Function
) {
    req.logger = logger;
    next();
}

export default logger;
