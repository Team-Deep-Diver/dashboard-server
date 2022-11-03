const bcrypt = require("bcrypt");
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
      groupName: { type: String },
      status: {
        type: String,
        enum: ["PARTICIPATING", "PENDING", "REJECTED"],
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
