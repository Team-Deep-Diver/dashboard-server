const express = require("express");
const router = express.Router();

const { colorCode } = require("./controllers/colorCodeController");

router.get("/", colorCode);

module.exports = router;
