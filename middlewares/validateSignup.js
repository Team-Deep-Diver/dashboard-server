const { body } = require("express-validator");

exports.validateSignup = [
  body("email")
    .notEmpty()
    .withMessage("is required")
    .isEmail()
    .withMessage("is invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("must be at least 8 chars long")
    .matches(/(?=.*\d)(?=.*[a-zA_Z])/)
    .withMessage("must contain at least one letter and one number"),
];
