const express = require("express");
const createError = require("http-errors");
const router = express.Router();

const User = require("../models/User");
const Group = require("../models/Group");

const { getGroupNotice } = require("./controllers/noticController");

const ERROR = require("../constants/error");

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userInfo = await User.findById(user_id);

    res.status(200).json(userInfo);
  } catch (err) {
    res.send(createError(403, ERROR.AUTH_FORBIDDEN));
  }
});

router.get("/:user_id/groups", async function (req, res, next) {
  try {
    const { user_id } = req.params;
    const userInfo = await User.findById(user_id);

    if (!userInfo) {
      return res.status(400).json({ message: ERROR.USER_NOT_FOUND });
    }

    if (userInfo.role === "ADMIN") {
      const groupInfo = await Group.findOne({ admin: user_id })
        .populate("applicants")
        .populate("members");

      return res.status(200).json({
        applicants: groupInfo.applicants,
        members: groupInfo.members,
      });
    }

    if (userInfo.role === "MEMBER") {
      return res.status(200).send(userInfo.groups);
    }
  } catch (err) {
    res.status(400).json({ message: ERROR.GROUP_NOT_FOUND });
  }
});

router.delete("/:user_id/groups/:group_id", async function (req, res, next) {
  try {
    const { user_id, group_id } = req.params;
    const result = await User.updateOne(
      { _id: user_id },
      { $pull: { groups: { groupId: group_id } } }
    );

    if (result.modifiedCount === 0) {
      return res.send(createError(400, ERROR.GROUP_NOT_FOUND));
    }

    await Group.updateOne({ _id: group_id }, { $pull: { members: user_id } });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.post("/:user_id/groups/:group_id", async function (req, res, next) {
  const userId = req.params["user_id"];
  const groupId = req.params["group_id"];

  try {
    const user = await User.findOne({ _id: userId });

    const appliedGroup = user.groups.filter((el) => {
      return String(el.groupId) === groupId;
    }).length;

    if (appliedGroup) {
      return res
        .status(400)
        .send(createError(400, ERROR.GROUP_APPLICATION_DUPLICATE));
    }
  } catch {
    return res.status(404).send(createError(404, ERROR.USER_NOT_FOUND));
  }

  try {
    const group = await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $push: {
          applicants: userId,
        },
      }
    );

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          groups: [
            {
              groupName: group.name,
              groupId,
              status: "PENDING",
            },
          ],
        },
      }
    );

    res.sendStatus(200);
  } catch (err) {
    return res.send(createError(404, ERROR.GROUP_NOT_FOUND));
  }
});

router.post(
  "/:user_id/groups/:group_id/:applicant_id",
  async function (req, res, next) {
    const { group_id, applicant_id } = req.params;
    const resultStatus = req.body.status;

    try {
      await User.updateOne(
        {
          _id: applicant_id,
          "groups.groupId": group_id,
        },
        { $set: { "groups.$.status": resultStatus } }
      );

      Group.findOneAndUpdate(
        { _id: group_id },
        { $pull: { applicants: applicant_id } },
        (err, data) => {
          if (err) {
            res.status(404).send({ message: ERROR.GROUP_NOT_FOUND });
          }
        }
      );

      if (resultStatus === "PARTICIPATING") {
        Group.findOneAndUpdate(
          { _id: group_id },
          { $push: { members: applicant_id } },
          (err, data) => {
            if (err) {
              res.status(404).send({ message: ERROR.GROUP_NOT_FOUND });
            }
          }
        );
      }

      res.sendStatus(201);
    } catch (err) {
      res.status(404).send({ message: ERROR.MEMBER_NOT_FOUND });
    }
  }
);

router.get("/:user_id/groupNotice", getGroupNotice);

module.exports = router;
