const ERROR = require("../../constants/error");

module.exports = {
  logout: function (req, res, next) {
    req.logout((err) => {
      if (err) {
        return res.status(400).json({ message: ERROR.AUTH_FORBIDDEN });
      }

      return res.sendStatus(200);
    });
  },
};
