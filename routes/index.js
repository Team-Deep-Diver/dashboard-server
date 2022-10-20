const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.json("server OK");
});

module.exports = router;
