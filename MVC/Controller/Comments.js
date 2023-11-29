const Comments = require("../Model/Comments");
const Posts = require("../Model/Posts");
const User = require("../Model/User");

const addComment = async (req, res, next) => {
  const user_id = req.user;
  const post_id = req.params.postId;
  const comment = req.body.comment;

  try {
    const userWhoCommented = await User.findById(user_id);
    const postOnWhichUserCommented = await Posts.findById(post_id);

    if (!userWhoCommented || !postOnWhichUserCommented) {
      return res.status(404).json({ message: "User or post not found!" });
    }

    const commentOfThePost = new Comments({
      comment: comment,
      post: post_id,
      user: user_id,
    });

    await commentOfThePost.save();

    postOnWhichUserCommented.comments.push(commentOfThePost._id);
    await postOnWhichUserCommented.save();

    if (!commentOfThePost) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res
      .status(201)
      .json({ message: "Comment posted sucessfully", commentOfThePost });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addComment,
};
