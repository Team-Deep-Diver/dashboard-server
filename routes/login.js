const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const createError = require("http-errors");

const ERROR = require("../constants/error");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err || !user) {
      return res.send(createError(400, ERROR.USER_NOT_FOUND));
    }
    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
});
module.exports = router;
