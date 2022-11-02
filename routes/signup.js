const express = require("express");
const router = express.Router();

const { validateSignup } = require("../middlewares/validateSignup");
const {
  signup,
  checkEmailDuplicate,
  checkGroupNameDuplicate,
} = require("./controllers/signupController");

router.post("/", validateSignup, signup);

router.post("/check-email", checkEmailDuplicate);

router.post("/check-group-name", checkGroupNameDuplicate);

module.exports = router;
