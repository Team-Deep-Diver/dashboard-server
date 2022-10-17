const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  colorCode: {
    type: String,
    enum: ["#CDDAFD", "#BEE1E6", "#E2ECE9", "#FDE2E4", "#FFF1E6"],
    required: true,
  },
  period: {
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
  },
  snapshots: [snapshotSchema],
});

module.exports = mongoose.model("Card", cardSchema);
