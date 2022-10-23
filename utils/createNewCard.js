const Card = require("../models/Card");
const Snapshot = require("../models/Snapshot");

async function createNewCard(socketValue) {
  const {
    createdBy,
    category,
    startDate,
    endDate,
    colorCode,
    todos,
    imgUrl,
    description,
    x,
    y,
  } = socketValue;

  const snapshot = await Snapshot.create({
    createdAt: new Date().toLocaleDateString(),
    category,
    value: {
      todos,
      imgUrl,
      description,
    },
    coordinate: { x, y },
  });

  await Card.create({
    createdBy,
    colorCode,
    period: {
      startDate: new Date(startDate).toLocaleDateString(),
      endDate: new Date(endDate).toLocaleDateString(),
    },
    snapshots: snapshot._id,
  });
}

module.exports = createNewCard;
