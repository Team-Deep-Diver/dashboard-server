const express = require("express");
const router = express.Router();

const { validateSignup } = require("../middlewares/validateSignup");
const {
  signup,
  checkEmailDuplicate,
  checkGroupNameDuplicate,
} = require("./controllers/signupController");

router.route("/").post(validateSignup, signup);

router.route("/check-email").post(checkEmailDuplicate);

router.route("/check-group-name").post(checkGroupNameDuplicate);

module.exports = router;
