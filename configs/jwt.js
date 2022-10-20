const jwt = require("jsonwebtoken");
const ERROR = require("../constants/error");

module.exports = {
  confirmToken: function (req, res, next) {
    const bearerHeader = req.headers["authorization"];
    console.log("verifyToken, bearerHeader:", bearerHeader);

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    console.log("bearerToken:", bearerToken);
    if (bearerToken !== "null") {
      req.token = bearerToken;
      return next();
    } else {
      return res.status(403).json({ message: ERROR.AUTH_FORBIDDEN });
    }
  },
  verifyToken: function (req, res, next) {
    console.log("Attempting to verify token:", req.token);
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
      if (err) {
        return res.status(403).json({ message: ERROR.AUTH_FORBIDDEN });
      } else {
        return next();
      }
    });
  },
};
