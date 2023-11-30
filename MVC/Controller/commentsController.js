const Comments = require("../Model/Comments");
const Posts = require("../Model/Posts");
const User = require("../Model/User");

//Add comment:
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

//Edit Comment:
const editComment = async (req, res, next) => {
  const user_id = req.user;
  const post_id = req.params.postId;
  const editedComment = req.body.comment;
  const comment_id = req.params.commentId;

  try {
    const user = await User.findById(user_id);
    const post = await Posts.findById(post_id);
    const comment = await Comments.findById(comment_id);

    if (
      !user ||
      !post ||
      !comment ||
      user._id.toString() !== comment.user.toString() ||
      post._id.toString() !== comment.post.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const editTheComment = await Comments.findByIdAndUpdate(
      comment_id,
      { comment: editedComment },
      { new: true }
    );
    await editTheComment.save();

    if (!editTheComment) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(201).json({
        message: "Comment edited sucessfully",
        editedComment: editTheComment,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addComment,
  editComment,
};
