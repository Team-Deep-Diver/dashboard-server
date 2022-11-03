const express = require("express");
const router = express.Router();

const { getColorCode } = require("./controllers/colorCodeController");

router.get("/", getColorCode);

module.exports = router;
