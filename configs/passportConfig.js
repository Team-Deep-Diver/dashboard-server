const bcrypt = require("bcrypt");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password" });
            }
          });
        } catch (err) {
          done(err);
        }
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
      }
    )
  );
};
