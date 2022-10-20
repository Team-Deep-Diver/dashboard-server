const espress = require("express");
const router = espress.Router();

router.post("/", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/login");
  });
});

module.exports = router;
