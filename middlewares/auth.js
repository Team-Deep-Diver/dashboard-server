const createError = require("http-errors");
const ERROR = require("../constants/error");

module.exports = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      return next();
    }

    res.send(createError(400, ERROR.INVALID_ACCOUNT));
  } catch (err) {
    res.send(createError(400, ERROR.AUTH_FORBIDDEN));
  }
};
