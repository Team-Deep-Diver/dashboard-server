const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN"],
    required: true,
    default: "MEMBER",
  },
  groups: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
      status: {
        type: String,
        enum: ["PARTICIPATING", "PENDING", "REJECTED"],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
