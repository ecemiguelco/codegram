const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: String,
  image: String,
  firstName: String,
  lastName: String,
  follower: Array,
  following: Array,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
