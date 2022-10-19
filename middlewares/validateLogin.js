const passport = require("passport");
const { body } = require("express-validator");
const ERROR = require("../constants/error");

exports.validateAuth = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (!user) {
      return res.json("login", { message: ERROR.INVALID_ACCOUNT });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return next();
    });
  })(req, res, next);
};

exports.validateLogin = [
  body("email")
    .notEmpty()
    .withMessage(ERROR.NO_EMAIL)
    .isEmail()
    .withMessage(ERROR.INVALID_EMAIL_FORMAT),
  body("password")
    .notEmpty()
    .withMessage(ERROR.NO_PASSWORD)
    .trim()
    .isLength({ min: 8 })
    .withMessage(ERROR.INVALID_PASSWORD_LENGTH)
    .matches(/(?=.*\d)(?=.*[a-zA_Z])/)
    .withMessage(ERROR.INVALID_PASSWORD_FORMAT)
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        return false;
      }
      return true;
    })
    .withMessage(ERROR.PASSWORDS_NOT_MATCH),
];
