const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  colorCode: {
    type: String,
    enum: ["#62FCAF", "#9300FE", "#11ffee", "#034EFD", "#fcf434"],
    required: true,
  },
  period: {
    startDate: {
      type: String,
      default: new Date(Date.now()).toLocaleDateString(),
    },
    endDate: {
      type: String,
      default: new Date(Date.now()).toLocaleDateString(),
    },
  },
  snapshots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Snapshot" }],
});

module.exports = mongoose.model("Card", cardSchema);
