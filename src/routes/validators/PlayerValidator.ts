import { checkSchema } from 'express-validator'

export const playerValidator = {
    createPlayer: checkSchema({
        email: {
            in: ['body'],
            isEmail: true,
            isEmpty:{
                errorMessage: 'Email is required',
                negated: true,
            },
            errorMessage: 'Invalid email'
        },
        password: {
            in: ['body'],
            isLength: {
                errorMessage: 'Password must be at least 6 characters long',
                options: { min: 6 }
            },
            isString: {
                errorMessage: 'Password must be a string',
            },
            isEmpty:{
                errorMessage: 'Password is required',
                negated: true,
            },
            errorMessage: 'Invalid password'
        },
    })
}
