const express = require("express");
const router = express.Router();

const { searchGroup } = require("./controllers/groupController");

router.get("/", searchGroup);

module.exports = router;
