export class ErrorNotSaved extends Error {
    constructor(message: string) {
        super(`${message} not saved.`);
    }
}
