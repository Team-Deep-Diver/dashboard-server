module.exports = {
  groups: async function (req, res, next) {
    try {
      const { user_id } = req.params;
      const userInfo = await User.findById(user_id);

      if (!userInfo) {
        return res.status(400).json({ message: ERROR.USER_NOT_FOUND });
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
        return res.status(200).json(userInfo.groups);
      }
    } catch (err) {
      res.status(400).json({ message: ERROR.GROUP_NOT_FOUND });
    }
  },
};
