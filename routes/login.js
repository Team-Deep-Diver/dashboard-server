const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    console.log(user);
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      // jwt.sign('token내용', 'JWT secretkey')
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
      console.log(token);
      return res.json({ user, token });
    });
  })(req, res, next);
});

module.exports = router;
