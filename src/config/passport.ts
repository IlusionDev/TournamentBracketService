import passport from 'passport'
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import Bcrypt from 'bcrypt'
import PlayerRepository  from "@/domain/repositories/PlayerRepository";


const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(new passportLocal(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {
        PlayerRepository.getRepository().findOne({ where: { email: username } }).then(function (user) {
            if (!user) return done(null, false);

            if (Bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        }).catch(function (rej) {
            done(rej, false);
        });
    }
));

var opts: any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.issuer = 'app.trombonpub.com';
opts.audience = 'trombonpub.com';

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    PlayerRepository.getRepository().findOne({ id: jwt_payload.sub }).then((user) => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }).catch((e) => {
        done(e, false);
    });
}));

export default passport;
