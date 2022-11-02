module.exports = {
  getGroupNotice: async function (req, res, next) {
    try {
      const { user_id } = req.params;

      const result = await User.find({
        _id: user_id,
      }).populate({
        path: "groups.groupId",
        populate: {
          path: "notices",
          match: {
            "notices.period.startDate": {
              $lte: new Date().toLocaleDateString(),
            },
            "notices.period.endDate": { $gte: new Date().toLocaleDateString() },
          },
        },
      });

      if (result[0].groups.length > 0) {
        const myGroupList = [];

        result[0].groups.map((group) => {
          if (group.status === "PARTICIPATING") {
            const { name, notices, colorCode } = group.groupId;

            myGroupList.push({
              name,
              notices: [...notices],
              colorCode,
            });
          }
        });

        res.status(200).json({ myGroupList });
      } else {
        res.status(200).json({ name: "", notices: [], colorCode: "" });
      }
    } catch (err) {
      next(err);
    }
  },
};
