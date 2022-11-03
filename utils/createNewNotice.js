const Group = require("../models/Group");
const Notice = require("../models/Notice");

async function createNewNotice(adminId, startDate, endDate, groupNotice) {
  const newNotice = await Notice.create({
    message: groupNotice,
    period: { startDate, endDate },
  });

  const groupInfo = await Group.findOneAndUpdate(
    { admin: adminId },
    { $push: { notices: newNotice._id } },
    { new: true }
  );

  const { name, colorCode } = groupInfo;
  return { name, colorCode, newNotice };
}

module.exports = createNewNotice;
