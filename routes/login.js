const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const createError = require("http-errors");

const ERROR = require("../constants/error");

router.post("/", async (req, res, next) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err || !user) {
        return res.send(createError(400, ERROR.USER_NOT_FOUND));
      }

      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);

      return res.json({ user, token: "Bearer " + token });
    })(req, res, next);
  } catch (err) {
    res.send(createError(400, ERROR.INVALID_ACCOUNT));
  }
});

module.exports = router;
