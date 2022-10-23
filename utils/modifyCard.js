const Snapshot = require("../models/Snapshot");

async function modifyCard(socketValue) {
  const { snapshotId, category, todos, imgUrl, description, x, y } =
    socketValue;

  await Snapshot.findByIdAndUpdate(snapshotId, {
    category,
    value: {
      todos,
      imgUrl,
      description,
    },
    coordinate: { x, y },
  });
}

module.exports = modifyCard;
