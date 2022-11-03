const url = require("url");

const Group = require("../../models/Group");

const ERROR = require("../../constants/error");

module.exports = {
  searchGroup: async function (req, res, next) {
    try {
      const { groupName } = url.parse(req.url, true).query;
      const regex = new RegExp(`${groupName}`);
      const groups = await Group.find({ name: regex });

      if (!groups.length) {
        return res.status(404).json({ message: ERROR.GROUP_NOT_FOUND });
      }

      const result = groups.map((group) => ({
        name: group.name,
        group_id: group._id,
      }));

      res.status(200).json(result);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
};
