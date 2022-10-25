const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  message: { type: String, required: true },
  period: {
    startDate: { type: String, default: Date.now },
    endDate: { type: String, default: Date.now },
  },
  createdAt: { type: String, default: Date.now },
});

module.exports = mongoose.model("Notice", noticeSchema);
