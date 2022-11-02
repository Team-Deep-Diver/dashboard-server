const bcrypt = require("bcrypt");

const User = require("../../models/User");
const Group = require("../../models/Group");

const validationCheck = require("../../services/validationCheck");
const randomGroupColorCode = require("../../utils/randomGroupColorCode");

module.exports = {
  signup: async function (req, res, next) {
    try {
      const { nickname, email, password, role, groupName } = req.body;
      const errorMessage = validationCheck(req);

      if (errorMessage) {
        return res.status(400).json({ error: errorMessage });
      }

      const user = await User.findOne({ email });
      const group = await Group.findOne({ name: groupName });

      if (user || (role === "ADMIN" && group)) {
        return res.status(400).json({
          message: "회원 가입에 실패하셨습니다. 다시 입력해주시길 바랍니다.",
        });
      }

      const newUser = new User({
        nickname,
        email,
        password,
        role,
      });

      bcrypt.genSalt(12, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) {
            throw err;
          } else {
            newUser.password = hash;

            try {
              await User.create(newUser);
            } catch (err) {
              next(err);
            }
          }
        });
      });

      if (role === "ADMIN") {
        console.log("newUser :::", newUser);
        const newGroup = await Group.create({
          name: groupName,
          admin: newUser._id,
          colorCode: randomGroupColorCode(),
        });

        await User.findOneAndUpdate(
          { email: newUser.email },
          {
            groups: {
              groupId: newGroup._id,
              groupName: newGroup.name,
              status: "PARTICIPATING",
            },
          }
        );
      }

      return res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  },
  checkEmailDuplicate: async function (req, res, next) {
    try {
      const { email } = req.body;
      const regex =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

      if (!regex.test(email)) {
        return res
          .status(400)
          .json({ message: "* 이메일 형식에 맞지 않습니다." });
      }

      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "* 이미 가입한 이메일입니다." });
      }

      return res.status(200).json({ message: "* 사용 가능한 이메일입니다." });
    } catch (err) {
      next(err);
    }
  },
  checkGroupNameDuplicate: async function (req, res, next) {
    try {
      const { groupName } = req.body;
      const group = await Group.findOne({ name: groupName });

      if (!groupName || groupName.length < 2) {
        return res
          .status(400)
          .json({ message: "* 그룹명은 최소 2자 이상 입력해주세요." });
      }

      if (group) {
        return res
          .status(400)
          .json({ message: "* 사용 불가능한 그룹명입니다." });
      }

      return res.status(200).json({ message: "* 사용 가능한 그룹명입니다." });
    } catch (err) {
      next(err);
    }
  },
};
