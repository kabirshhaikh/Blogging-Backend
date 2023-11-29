const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
  ],
  profilePicture: String,
});

const User = mongoose.model("User - Blogging", userSchema);
module.exports = User;
