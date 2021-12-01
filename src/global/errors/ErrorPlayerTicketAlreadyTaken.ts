export class ErrorPlayerTicketAlreadyTaken extends Error {
    constructor() {
        super('Player already has a ticket for this tournament');
    }
}
