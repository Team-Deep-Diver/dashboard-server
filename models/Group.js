const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  colorCode: { type: String },
  notices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],
});

module.exports = mongoose.model("Group", groupSchema);
