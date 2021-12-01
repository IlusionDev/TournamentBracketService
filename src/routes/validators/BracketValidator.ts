import { checkSchema } from 'express-validator';

export const bracketValidator = {
    create: checkSchema({
        reward: {
            in: ['body'],
            isInt: true,
            errorMessage: 'Reward must be an integer',
            isEmpty: {
                errorMessage: 'Reward is required',
                negated: true,
            },
            toInt: true,
        },
        price: {
            in: ['body'],
            isInt: true,
            errorMessage: 'Price must be an integer',
            isEmpty: {
                errorMessage: 'Price is required',
                negated: true,
            },
            toInt: true,
        },
        ticketSlots: {
            in: ['body'],
            isInt: true,
            errorMessage: 'Ticket slots must be an integer',
            isEmpty: {
                errorMessage: 'Ticket slots is required',
                negated: true,
            },
            toInt: true,
        },
    }),
    newBracketPlayerParticipant: checkSchema({
        bracketId: {
            in: ['body'],
            isString: true,
            errorMessage: 'Bracket ID must be an integer',
            isEmpty: {
                errorMessage: 'Bracket ID is required',
                negated: true,
            },
        },
        playerId: {
            in: ['body'],
            isString: true,
            errorMessage: 'Player ID must be an integer',
            isEmpty: {
                errorMessage: 'Player ID is required',
                negated: true,
            },
        },
    }),
    bracketStart: checkSchema({
        bracketId: {
            in: ['body'],
            isString: true,
            errorMessage: 'Bracket ID must be an integer',
            isEmpty: {
                errorMessage: 'Bracket ID is required',
                negated: true,
            },
        },
    })
}
