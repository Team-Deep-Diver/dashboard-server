const Card = require("../models/Card");
const Snapshot = require("../models/Snapshot");

async function deleteCard(cardId, snapshotId) {
  await Snapshot.findByIdAndDelete(snapshotId);
  await Card.findByIdAndUpdate(cardId, {
    $pull: { snapshots: snapshotId },
  });
}

module.exports = deleteCard;
