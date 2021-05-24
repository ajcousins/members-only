const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A message must have text."],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
  },
  hue: {
    type: Number,
    default: () => {
      return Math.floor(Math.random() * 360);
    },
    required: true,
    immutable: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
