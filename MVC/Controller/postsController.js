const Posts = require("../Model/Posts");
const User = require("../Model/User");

const createPost = async (req, res, next) => {
  const USER = req.user;
  console.log("User id is:" + USER);

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

module.exports = {
  createPost,
};
