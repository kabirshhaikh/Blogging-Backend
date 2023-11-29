const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  comment: {
    type: String,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Posts",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Comments - Blogging", commentsSchema);
