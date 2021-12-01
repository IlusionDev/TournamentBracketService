import { checkSchema } from 'express-validator'

export const matchValidator = {
    saveMatchStats: checkSchema( {
        playerId: {
            in: ['body'],
            errorMessage: 'Player ID is required',
            isString: true,
            isEmpty: {
                errorMessage: 'Player ID is required',
                negated: true,
            },
        },
        bracketId: {
            in: ['body'],
            errorMessage: 'Bracket ID is required',
            isString: true,
            isEmpty: {
                errorMessage: 'Bracket ID is required',
                negated: true,
            },
        },
        points: {
            in: ['body'],
            errorMessage: 'Points is required',
            isInt: true,
            isEmpty: {
                errorMessage: 'Points is required',
                negated: true,
            },
        },
    }),
    updateMatchStats: checkSchema({
        id: {
            in: ['body'],
            errorMessage: 'MatchStat ID is required',
            isString: true,
            isEmpty: {
                negated: true,
                errorMessage: 'MatchStat ID is required',
            },
        }
    })
}
