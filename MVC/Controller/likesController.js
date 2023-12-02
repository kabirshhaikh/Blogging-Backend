const User = require("../Model/User");
const Posts = require("../Model/Posts");
const Likes = require("../Model/Likes");

const postLike = async (req, res, next) => {
  const user_id = req.user;
  const post_id = req.params.postId;

  try {
    const user = await User.findById(user_id);
    const post = await Posts.findById(post_id);

    if (!user || !post) {
      return res.status(404).json({ message: "User or Post not found!" });
    }

    const userAlreadyLiked = post.likes.some((like) =>
      like.user.equals(user._id)
    );

    if (userAlreadyLiked) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    const likeObject = new Likes({
      user: user._id,
      post: post._id,
    });

    await likeObject.save();

    await post.likes.push(likeObject._id);
    await post.save(); // Save the post with the updated likes array

    return res.status(201).json({
      message: `Like added to the post by user ${user.firstName}`,
      likeObject,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  postLike,
};
