const jwt = require("jsonwebtoken");
const passport = require("passport");

const ERROR = require("../../constants/error");
const validationCheck = require("../../utils/validationCheck");

module.exports = {
  login: async function (req, res, next) {
    const errorMessage = validationCheck(req);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    try {
      passport.authenticate("local", (err, user) => {
        if (err || !user) {
          return res.status(400).json({ message: ERROR.USER_NOT_FOUND });
        }

        if (user) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

          res.status(200).json({ user, token: "Bearer " + token });
        }
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  },
};
