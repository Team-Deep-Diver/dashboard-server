const mongoose = require("mongoose");

const snapshotSchema = new mongoose.Schema({
  createdAt: { type: String, required: true },
  category: { type: String, required: true },
  value: {
    todos: [
      {
        text: { type: String, required: true },
        checked: { type: Boolean, default: false },
      },
    ],
    imgUrl: { type: String },
    description: { type: String },
  },
  coordinate: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
});

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

module.exports = {
  Card: mongoose.model("Card", cardSchema),
  Snapshot: mongoose.model("Snapshot", snapshotSchema),
};
