const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  message: { type: String, required: true },
  period: {
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notice", noticeSchema);
