const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  postPicture: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Likes",
    },
  ],
});

postSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Posts - Blogging", postSchema);
