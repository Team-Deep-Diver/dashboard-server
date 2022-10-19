const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: "No account" });
          }

          return done(null, user);
          // const isValid = await validPassord(password, user.password);
          // if (isValid) {
          //   return done(null, user);
          // } else {
          //   return done(null, false, { message: "Incorrect password" });
          // }
        } catch (err) {
          done(err);
        }
      }
    )
  );

  //JWT Strategy
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      function (jwtPayload, done) {
        console.log(jwtPayload);
        return User.findOneById(jwtPayload.id)
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
};
