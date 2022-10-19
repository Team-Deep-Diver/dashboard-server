const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const ERROR = require("../constants/error");

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: ERROR.USER_NOT_FOUND });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
