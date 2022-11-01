const { body } = require("express-validator");
const ERROR = require("../constants/error");

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
];
