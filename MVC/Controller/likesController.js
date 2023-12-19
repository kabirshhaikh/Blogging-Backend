const User = require("../Model/User");
const Posts = require("../Model/Posts");
const Likes = require("../Model/Likes");

const postLike = async (req, res, next) => {
  const user_id = req.user;
  const post_id = req.params.postId;

  try {
    const post = await Posts.findById(post_id);
    const user = await User.findById(user_id);

    if (!post || !user) {
      return res.status(404).json({ message: "Couldn't find post or user" });
    }

    const like = new Likes({
      user: user_id,
      post: post_id,
    });

    await like.save();

    post.likes.push(like._id);
    await post.save();

    return res.status(201).json({
      message: `Like added by ${user.firstName}`,
      likeObject: like,
      postObject: post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  postLike,
};
