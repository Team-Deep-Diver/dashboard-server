const express = require("express");
const router = express.Router();

const { validateLogin } = require("../middlewares/validateLogin");
const { login } = require("./controllers/loginController");

router.post("/", validateLogin, login);

module.exports = router;
