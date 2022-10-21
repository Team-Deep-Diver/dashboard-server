const mongoose = require("mongoose");

const snapshotSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
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

// module.exports = mongoose.model("Snapshot", snapshotSchema);
