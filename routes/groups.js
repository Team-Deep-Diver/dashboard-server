const createError = require("http-errors");
const express = require("express");
const url = require("url");
const router = express.Router();

const Group = require("../models/Group");

const ERROR = require("../constants/error");

router.get("/", async function (req, res, next) {
  try {
    const { groupName } = url.parse(req.url, true).query;
    const regex = new RegExp(`${groupName}`);
    const groups = await Group.find({ name: regex });

    if (!groups.length) {
      return res.send(createError(404, ERROR.GROUP_NOT_FOUND));
    }

    const result = [];
    groups.map((group) => {
      result.push({ name: group.name, group_id: group._id });
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
