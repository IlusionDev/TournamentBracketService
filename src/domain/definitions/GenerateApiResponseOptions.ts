export default interface GenerateApiResponseOptions {
    error?: boolean;
    message?: string;
    sanitize?: any;
    statusCode?: number;
    stack?: String;
    hasMore?: boolean;
    take?: number;
}
