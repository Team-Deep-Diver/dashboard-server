const espress = require("express");
const router = espress.Router();

const ERROR = require("../constants/error");

router.post("/", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return res.send(createError(400, ERROR.NO_ACCOUNT));
    }

    return res.sendStatus(200);
  });
});

module.exports = router;
