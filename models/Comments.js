const mongoose = require("mongoose");

const CommentsSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "Writer is required"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", CommentsSchema);
