require("dotenv").config();
const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtVerify = require("../configs/jwt");
const { validateAuth, validateLogin } = require("../middlewares/validateLogin");

const User = require("../models/User");

router.post(
  "/",
  validateLogin,
  validateAuth,
  jwtVerify.confirmToken,
  jwtVerify.verifyToken,
  (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      if (err) {
        console.error(`error ${err}`);
        return next(err);
      }

      if (!user) {
        return res.res.redirect("/login");
      }

      if (info) {
        return res.status(400).json(info.message);
      } else {
        try {
          const user = await User.findOne({ email: req.body.email });

          if (user) {
            const token = jwt.sign(
              { email: user.email },
              process.env.JWT_SECRET_KEY
            );

            return res.json({
              auth: true,
              token, //BE랑 FE가 어떻게 주고 받을지 결정 필요
            });
          }
        } catch (err) {
          next(err);
        }
      }
    })(req, res, next);
  }
);

module.exports = router;
