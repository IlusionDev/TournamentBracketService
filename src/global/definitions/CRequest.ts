import { Request } from "express-serve-static-core";
import { Logger } from "winston";
import ApiResponseService from "@/domain/services/ApiResponseService";

export default interface CRequest extends Request {
  logger: Logger;
  apiResponse: ApiResponseService;
}
