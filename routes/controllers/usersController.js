const ERROR = require("../../constants/error");

const User = require("../../models/User");
const Group = require("../../models/Group");

module.exports = {
  getUserInfo: async function (req, res, next) {
    try {
      const { user_id } = req.params;
      const userInfo = await User.findById(user_id);

      res.status(200).json(userInfo);
    } catch (err) {
      err.status = 403;
      err.message = ERROR.AUTH_FORBIDDEN;
      next(err);
    }
  },
  getGroupInfo: async function (req, res, next) {
    try {
      const { user_id } = req.params;
      const userInfo = await User.findById(user_id);

      if (!userInfo) {
        return res.status(400).json({ message: ERROR.USER_NOT_FOUND });
      }

      if (userInfo.role === "MEMBER") {
        return res.status(200).json(userInfo.groups);
      }

      if (userInfo.role === "ADMIN") {
        const groupInfo = await Group.findOne({ admin: user_id })
          .populate("applicants")
          .populate("members");

        return res.status(200).json({
          groupInfo,
          applicants: groupInfo.applicants,
          members: groupInfo.members,
        });
      }
    } catch (err) {
      err.message = ERROR.SERVER_ERROR;
      next(err);
    }
  },
  withdrawGroup: async function (req, res, next) {
    try {
      const { user_id, group_id } = req.params;

      const result = await User.updateOne(
        { _id: user_id },
        { $pull: { groups: { groupId: group_id } } }
      );

      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: ERROR.GROUP_NOT_FOUND });
      }

      await Group.updateOne({ _id: group_id }, { $pull: { members: user_id } });

      res.sendStatus(204);
    } catch (err) {
      err.message = ERROR.SERVER_ERROR;
      next(err);
    }
  },
  applyGroup: async function (req, res, next) {
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
          .json({ message: ERROR.GROUP_APPLICATION_DUPLICATE });
      }
    } catch {
      return res.status(404).json({ message: ERROR.USER_NOT_FOUND });
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
      err.status = 404;
      err.message = ERROR.GROUP_NOT_FOUND;
      next(err);
    }
  },
  updateApplicantStatus: async function (req, res, next) {
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
            res.status(404).json({ message: ERROR.GROUP_NOT_FOUND });
          }
        }
      );

      if (resultStatus === "PARTICIPATING") {
        Group.findOneAndUpdate(
          { _id: group_id },
          { $push: { members: applicant_id } },
          (err, data) => {
            if (err) {
              res.status(404).json({ message: ERROR.GROUP_NOT_FOUND });
            }
          }
        );
      }

      res.sendStatus(201);
    } catch (err) {
      err.status = 404;
      err.message = ERROR.MEMBER_NOT_FOUND;
      next(err);
    }
  },
  getGroupNotice: async function (req, res, next) {
    try {
      const { user_id } = req.params;
      const myGroupList = [];

      const groupInfo = await User.find({
        _id: user_id,
      }).populate({
        path: "groups.groupId",
        populate: {
          path: "notices",
          match: {
            "period.startDate": { $lte: new Date().toLocaleDateString() },
            "period.endDate": { $gte: new Date().toLocaleDateString() },
          },
        },
      });

      groupInfo[0].groups.map((group) => {
        if (group.status === "PARTICIPATING") {
          const { name, notices, colorCode } = group.groupId;

          for (const notice of notices) {
            myGroupList.push({
              groupName: name,
              colorCode,
              startDate: notice.period.startDate,
              endDate: notice.period.endDate,
              message: notice.message,
            });
          }
        }
      });

      res.status(200).json({ myGroupList });
    } catch (err) {
      err.status = 400;
      err.message = ERROR.GROUP_NOT_FOUND;
      next(err);
    }
  },
};
