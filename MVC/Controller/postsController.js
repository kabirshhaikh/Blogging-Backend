const Posts = require("../Model/Posts");
const User = require("../Model/User");
const path = require("path");
const S3 = require("../Config/Aws-Config");
const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const ACCESSKEYID = process.env.accessKeyId;
const SECRETACCESSKEY = process.env.secretAccessKey;
const REGION = process.env.regionForPostImages;

AWS.config.update({
  accessKeyId: ACCESSKEYID,
  secretAccessKey: SECRETACCESSKEY,
  region: REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

//Create new post:
const createPost = async (req, res, next) => {
  const USER = req.user;

  const loggedInUser = await User.findById(USER);

  if (!loggedInUser) {
    return res.status(500).json({ message: "Internal Error" });
  }

  const title = req.body.title;
  const content = req.body.content;
  const postPicture = req.file;
  const picturePath = postPicture.path;

  let binaryDataa = "";
  fs.readFile(picturePath, async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message:
          "Something went wrong! Picture upload problem, hence cannot upload the image to S3.",
      });
    } else {
      const DATA = data.toString("base64");
      binaryDataa = Buffer.from(DATA, "base64");
      try {
        let s3Key = "";
        if (postPicture) {
          s3Key = `Images/${postPicture.originalname}`;

          const uploadParams = {
            Bucket: "postimageblogging",
            Key: s3Key,
            Body: binaryDataa,
            ContentType: postPicture.mimetype,
          };

          s3.putObject(uploadParams, (error, data) => {
            if (error) {
              console.error(error);
              return res
                .status(500)
                .json({ message: " Error uploading image to S3 bucket" });
            }
            console.log(data);
            console.log("Image uploaded sucessfully!");
          });
        }

        const newPost = new Posts({
          title: title,
          content: content,
          user: USER,
          postPicture: s3Key,
        });

        const savedPost = await newPost.save();

        if (!savedPost) {
          return res.status(500).json({ message: "Something went wrong!" });
        }

        loggedInUser.posts.push(savedPost._id);
        await loggedInUser.save();

        return res.status(201).json({
          message: "New post created successfully",
          new: savedPost,
        });
      } catch (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
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

//Update a post:
const updatePost = async (req, res, next) => {
  const USER_ID = req.user;
  const POST_ID = req.params.id;
  const titleToUpdate = req.body.title;
  const contentToUpdate = req.body.content;

  const postPicture = req.file;
  const imagePath = postPicture
    ? path.join("Images", postPicture.originalname)
    : null;

  console.log(titleToUpdate, contentToUpdate, imagePath + "From patch");

  try {
    const userWhoCreatedPost = await User.findById(USER_ID);
    const post = await Posts.findById(POST_ID);

    if (!userWhoCreatedPost.posts.includes(POST_ID)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      POST_ID,
      {
        title:
          titleToUpdate === null || titleToUpdate === undefined
            ? post.title
            : titleToUpdate,
        content:
          contentToUpdate === null || contentToUpdate === undefined
            ? post.content
            : contentToUpdate,
        postPicture:
          postPicture === null || postPicture === undefined
            ? post.postPicture
            : imagePath,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      return res
        .status(201)
        .json({ message: "Post updated sucessfully", updatedPost });
    }
  } catch (err) {
    console.log(err);
  }
};

//Get all posts:
const getAllPosts = async (req, res, next) => {
  try {
    const allPosts = await Posts.find();
    if (!allPosts) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Found all post's", allPosts });
  } catch (err) {
    console.log(err);
  }
};

//Search a post:
const searchPost = async (req, res, next) => {
  const searchQuery = req.query.q;
  try {
    const results = await Posts.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Unable to seach the request" });
    }
    return res
      .status(200)
      .json({ message: "Found the search results", results });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal Server Error!");
  }
};

module.exports = {
  createPost,
  deletePost,
  updatePost,
  getAllPosts,
  searchPost,
};
