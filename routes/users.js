const express = require("express");
const createError = require("http-errors");
const router = express.Router();

const User = require("../models/User");
const Group = require("../models/Group");

const ERROR = require("../constants/error");

router.get("/:user_id", async function (req, res, next) {
  const { user_id } = req.params;
  const userInfo = await User.findById(user_id);

  res.status(200).json(userInfo);
});

router.get("/:user_id/groups", async function (req, res, next) {
  try {
    const { user_id } = req.params;
    const userInfo = await User.findById(user_id);

    if (!userInfo) {
      return res.send(createError(400, ERROR.USER_NOT_FOUND));
    }

    if (userInfo.role === "ADMIN") {
      const applicants = await Group.findOne({ admin: user_id }).populate(
        "applicants"
      );
      const memebers = await Group.findOne({ admin: user_id }).populate(
        "members"
      );

      return res.status(200).json({ applicants, memebers });
    }

    if (userInfo.role === "MEMBER") {
      return res.json(userInfo.groups);
    }

    return res.status(200).send(userInfo.groups);
  } catch (err) {
    next(err);
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
      return res.send(createError(400, ERROR.GROUP_APPLICATION_DUPLICATE));
    }
  } catch {
    return res.send(createError(404, ERROR.USER_NOT_FOUND));
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
  } catch (err) {
    return res.send(createError(404, ERROR.GROUP_NOT_FOUND));
  }
});

router.post(
  "/:user_id/groups/:group_id/:applicants_id",
  async function (req, res, next) {
    const { user_id, group_id, applicants_id } = req.params;
    const resultStatus = req.body.status;

    try {
      await User.findById(user_id);

      await User.updateOne(
        {
          _id: applicants_id,
          "groups.groupId": group_id,
        },
        { $set: { "groups.$.status": resultStatus } }
      );

      if (resultStatus === "PARTICIPATING") {
        await Group.findOneAndUpdate(
          { _id: group_id },
          { $push: { members: applicants_id } },
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(404).send({ message: ERROR.GROUP_NOT_FOUND });
            }
          }
        );
      }

      await Group.findOneAndUpdate(
        { _id: group_id },
        { $pull: { applicants: applicants_id } },
        (err, data) => {
          if (err) {
            console.error(err);
            res.status(404).send({ message: ERROR.GROUP_NOT_FOUND });
          }
        }
      );

      res.sendStatus(201);
    } catch (err) {
      console.error(err);
      res.status(404).send({ message: ERROR.MEMBER_NOT_FOUND });
    }
  }
);

module.exports = router;
