const express = require("express");
const createError = require("http-errors");
const router = express.Router();

const User = require("../models/User");
const Card = require("../models/Card");
const Group = require("../models/Group");

const ERROR = require("../constants/error");
const auth = require("../middlewares/auth");

//분리 시도중
router.get("/:user_id", auth, async (req, res) => {
  try {
    const { user_id } = req.params;
    const userInfo = await User.findById(user_id);

    res.status(200).json(userInfo);
  } catch (err) {
    res.send(createError(403, ERROR.AUTH_FORBIDDEN));
  }
});

//됐던거
// router.get(
//   "/:user_id",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     try {
//       const token = req.headers.authorization.split(" ")[1];

//       if (token) {
//         const { user_id } = req.params;
//         const userInfo = await User.findById(user_id);

//         res.status(200).json(userInfo);
//       }
//
//      res.send(createError(400, ERROR.INVALID_ACCOUNT));
//     } catch (err) {
//       res.send(createError(400, ERROR.AUTH_FORBIDDEN));
//     }
//   }
// );

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
      const members = await Group.findOne({ admin: user_id }).populate(
        "members"
      );

      return res.status(200).json({ applicants, members });
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

      if (resultStatus === "PARTICIPATING") {
        Group.findOneAndUpdate(
          { _id: group_id },
          { $push: { members: applicant_id } },
          (err, data) => {
            if (err) {
              console.error(err);
              res.status(404).send({ message: ERROR.GROUP_NOT_FOUND });
            }
          }
        );
      }

      Group.findOneAndUpdate(
        { _id: group_id },
        { $pull: { applicants: applicant_id } },
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
