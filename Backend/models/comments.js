const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userID: { type: String },
  postID: { type: String },
  chronoId: { type: Number, required: true },
  text: { type: String, required: true },
  active: { type: Boolean, required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
