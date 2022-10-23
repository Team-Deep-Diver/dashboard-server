const Card = require("../models/Card");
const Snapshot = require("../models/Snapshot");

async function updateRecentCards(recentCards, currentDate) {
  recentCards.forEach(async (card) => {
    const newSnapshot = await Snapshot.create({
      createdAt: new Date(currentDate).toLocaleDateString(),
      category: card.snapshots[card.snapshots.length - 1].category,
      value: card.snapshots[card.snapshots.length - 1].value,
      coordinate: card.snapshots[card.snapshots.length - 1].coordinate,
    });

    await Card.findByIdAndUpdate(card._id, {
      $push: { snapshots: newSnapshot._id },
    });
  });
}

module.exports = updateRecentCards;
