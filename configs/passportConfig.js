const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

const ERROR = require("../constants/error");

module.exports = function () {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);

      if (user) {
        done(null, user);
      }
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: ERROR.INVALID_ACCOUNT });
          }

          if (user.password !== password) {
            return done(null, false, { message: ERROR.PASSWORDS_NOT_MATCH });
          }

          return done(null, user);
        } catch (err) {
          done(err);
        }

        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (!user) {
            return done(null, false, { message: ERROR.AUTH_FORBIDDEN });
          }

          return done(null, user);
        } catch (err) {
          done(err);
        }

        return done(null, user);
      }
    )
  );
};
