export default class ApiResponseDto {
  message?: string;
  data: any;
  error: boolean | undefined;
  statusCode?: number;
  stack?: String;
  take?: number;
  hasMore?: boolean;
}
