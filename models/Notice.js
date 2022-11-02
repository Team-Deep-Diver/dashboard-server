const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  message: { type: String, required: true },
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
  createdAt: { type: String, default: new Date(Date.now()).toLocaleDateString() },
});

module.exports = mongoose.model("Notice", noticeSchema);
