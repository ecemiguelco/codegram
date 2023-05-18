const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: String,
  identifier: String,
  chronoId: Number,
  image: { type: String, required: true },
  caption: { type: String, required: true },
  likes: String,
});

module.exports = mongoose.model("Post", postSchema);
