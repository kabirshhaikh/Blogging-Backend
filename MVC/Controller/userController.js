const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const Posts = require("../Model/Posts");
const AWS = require("aws-sdk");
const fs = require("fs");

const SECRETKEY = "thisIsATempSecretKeyIAmUsingForTheBackEndApplication";

const saltRounds = 10;

AWS.config.update({
  accessKeyId: "AKIA4MTWNO7RVOEA3DSZ",
  secretAccessKey: "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",
  region: "us-east-2",
});

// Create an S3 instance
const s3 = new AWS.S3();

//Sign up user:
const signupUser = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;
  const profilePicture = req.file;

  const profilePicurePath = profilePicture.path;
  let binaryData = "";

  fs.readFile(profilePicurePath, async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message:
          "Something went wrong with upload of profile picture to S3 Bucket",
      });
    } else {
      const DATA = data.toString("base64");
      binaryData = Buffer.from(DATA, "base64");
      let s3ProfilePictureKey = "";

      if (profilePicture) {
        s3ProfilePictureKey = `ProfilePicture/${profilePicture.originalname}`;

        const params = {
          Bucket: "profilepicturebucketforbackendproject",
          Key: s3ProfilePictureKey,
          Body: binaryData,
          ContentType: profilePicture.mimetype,
        };

        s3.putObject(params, (err, data) => {
          if (err) {
            console.log(err + "Unable to upload the profile picture to S3");
          } else {
            console.log(
              "Sucessfully uploaded the profile picture to S3 bucket"
            );
          }
        });
        try {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({
              message: "User already exists, please choose an unique email",
            });
          }

          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            gender: gender,
            profilePicture: s3ProfilePictureKey,
          });

          await newUser.save();

          const sendData = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            gender: newUser.gender,
            profilePicture: newUser.profilePicture,
          };

          return res.status(200).json({
            message: "New user created",
            user: sendData,
            redirectTo: "/login",
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
};

//Login user:
const loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const loggedInUser = await User.findOne({ email });

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ message: "User not found in the database!" });
    }

    const decodedPassword = await bcrypt.compare(
      password,
      loggedInUser.password
    );

    if (!decodedPassword) {
      return res.status(401).json({ message: "Password does not match" });
    }

    const token = jwt.sign(
      {
        firstName: loggedInUser.firstName,
        userId: loggedInUser._id,
      },
      SECRETKEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "User logged in", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get all posts of a specific user:
const getAllPostsOfAUser = async (req, res, next) => {
  const user_id = req.params.userId;
  try {
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "No posts found!" });
    }

    const posts = await Posts.find({ user: user._id });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts made by user" });
    }

    return res
      .status(500)
      .json({ message: `All posts made by ${user.firstName} `, posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const protectedRoute = async (req, res, next) => {
  const user = req.user;
  const welcomeUser = await User.findById(user);

  if (!welcomeUser) {
    return res.status(500).json("Internal Server Error");
  }

  return res.status(200).json({
    message: `Welcome ${welcomeUser.firstName} to the protected route`,
  });
};

module.exports = {
  signupUser,
  loginUser,
  protectedRoute,
  getAllPostsOfAUser,
};
