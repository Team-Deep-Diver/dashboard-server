const createError = require("http-errors");
const User = require("../../models/User");
const Group = require("../../models/Group");

const ERROR = require("../../constants/error");
const validationCheck = require("../../utils/validationCheck");

module.exports = {
  signup: async function (req, res, next) {
    try {
      const { nickname, email, password, role, groups } = req.body;
      const errorMessage = validationCheck(req);

      if (errorMessage) {
        return res.send(createError(400, { message: errorMessage }));
      }

      await User.create({
        nickname,
        email,
        password,
        role,
        groups,
      });

      return res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  },
  checkEmailDuplicate: async function (req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        return res.send(createError(400, ERROR.EMAIL_DUPLICATE));
      }

      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
  checkGroupNameDuplicate: async function (req, res, next) {
    try {
      const { groupName } = req.body;
      const group = await Group.findOne({ name: groupName });

      if (group) {
        return res.send(createError(400, ERROR.GROUP_NAME_DUPLICATE));
      }

      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
};
