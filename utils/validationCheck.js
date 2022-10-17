const { validationResult } = require("express-validator");

function validationCheck(req) {
  const { errors } = validationResult(req);

  if (errors.length > 0) {
    const errorMessage = errors[0].msg;
    return errorMessage;
  }

  return null;
}

module.exports = validationCheck;
