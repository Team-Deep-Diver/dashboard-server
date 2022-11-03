const Card = require("../models/Card");

async function getTodayCards(user_id, currentDate) {
  const cards = await Card.find({
    createdBy: user_id,
    "period.startDate": { $lte: new Date(currentDate).toLocaleDateString() },
    "period.endDate": { $gte: new Date(currentDate).toLocaleDateString() },
  }).populate({
    path: "snapshots",
    match: { createdAt: new Date(currentDate).toLocaleDateString() },
  });

  return cards;
}

module.exports = getTodayCards;
