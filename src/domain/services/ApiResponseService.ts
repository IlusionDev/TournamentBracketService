import ApiResponseDto from "@/domain/definitions/dto/ApiResponseDto";
import CRequest from "@/global/definitions/CRequest";
import { plainToClass } from "class-transformer";
import GenerateApiResponseOptions from "@/domain/definitions/GenerateApiResponseOptions";
import GenerateAndSendErrorReponseOptions from "@/domain/definitions/GenerateAndSendErrorResponseOptions";
import { Response } from "express";
import ErrorApi from "@/global/errors/ErrorApi";

export default class ApiResponseService {
    private req: CRequest;

    private res: Response;

    constructor(req: CRequest, res: Response) {
        this.req = req;
        this.res = res;
    }

    static getInstance(req: CRequest, res: Response): ApiResponseService {
        return new ApiResponseService(req, res);
    }

    generateApiResponse<T>(
        data: T,
        options?: GenerateApiResponseOptions
    ): ApiResponseDto {
        const apiResponse: ApiResponseDto = new ApiResponseDto();
        if (data) {
            if (options?.sanitize) {
                apiResponse.data = plainToClass(options.sanitize, data);
            } else {
                apiResponse.data = data;
            }
        }
        apiResponse.error = options?.error ? options.error : false;
        options?.message ? (apiResponse.message = options?.message) : null;
        apiResponse.statusCode = options?.statusCode || 200;
        apiResponse.stack = options?.stack;
        apiResponse.hasMore = options?.hasMore;
        apiResponse.take = options?.take;

        return apiResponse;
    }

    generateApiErrorResponse<T>(
        options?: GenerateApiResponseOptions
    ): ApiResponseDto {
        return this.generateApiResponse(null, {
            error: true,
            statusCode: 500,
            ...options,
        });
    }

    generateAndSendWithStatus(data: any, options?: GenerateApiResponseOptions) {
        const statusCode = options?.statusCode ? options.statusCode : 200;
        const response = this.res
            .status(statusCode)
            .send(this.generateApiResponse(data, options));

        return response;
    }

    generateAndSendErrorReponse(
        error: ErrorApi,
        options?: GenerateAndSendErrorReponseOptions
    ) {
        let statusCode: number = error?.statusCode
            ? error.statusCode
            : (500 as number);
        statusCode = options?.statusCode ? options.statusCode : statusCode;
        this.req.logger.error(
            error?.message || options?.message,
            error?.stack || ""
        );
        const stack = error.stack;
        return this.res.status(statusCode).send(
            this.generateApiResponse(null, {
                ...options,
                error: true,
                message: error?.message || options?.error?.message,
                statusCode,
                stack,
            })
        );
    }
}
