export class ErrorNotUpdated extends Error {
    constructor(message: string) {
        super(`${message} not updated`);
    }
}
