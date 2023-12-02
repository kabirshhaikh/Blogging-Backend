const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likesSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Posts",
  },
});

module.exports = mongoose.model("Likes - Blogging backend", likesSchema);
