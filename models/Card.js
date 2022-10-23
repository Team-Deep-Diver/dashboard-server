const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  colorCode: {
    type: String,
    enum: ["#CDDAFD", "#BEE1E6", "#E2ECE9", "#FDE2E4", "#FFF1E6"],
    required: true,
  },
  period: {
    startDate: { type: String },
    endDate: { type: String },
  },
  snapshots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Snapshot" }],
});

module.exports = mongoose.model("Card", cardSchema);
