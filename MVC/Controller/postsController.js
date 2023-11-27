const Posts = require("../Model/Posts");
const User = require("../Model/User");

//Create new post:
const createPost = async (req, res, next) => {
  const USER = req.user;

  const loggedInUser = await User.findById(USER);

  if (!loggedInUser) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const title = req.body.title;
  const content = req.body.content;

  try {
    const newPost = new Posts({
      title: title,
      content: content,
      user: USER,
    });

    if (!newPost) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    newPost.save();

    loggedInUser.posts.push(newPost._id);
    await loggedInUser.save();

    return res
      .status(201)
      .json({ message: "New post created sucessfully", new: newPost });
  } catch (err) {
    console.log(err);
  }
};

//Delete a post:
const deletePost = async (req, res, next) => {
  const USER_ID = req.user;
  const userWhoCreatedPost = await User.findById(USER_ID);
  const postId = req.params.id;
  const POST = await Posts.findById(postId);
  try {
    if (!POST) {
      return res.status(500).json("Internal Server Error");
    }
    if (!userWhoCreatedPost.posts.includes(postId)) {
      return res
        .status(403)
        .json({ message: "Unauthorised to delete the post" });
    }
    const postDeleted = await Posts.findByIdAndDelete(POST);
    if (!postDeleted) {
      return res.status(500).json({ message: "Unable to delete the post" });
    }
    userWhoCreatedPost.posts.pull(postId);
    await userWhoCreatedPost.save();
    return res.status(200).json({ message: "Post deleted sucessfully" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createPost,
  deletePost,
};
