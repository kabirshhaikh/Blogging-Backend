const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRETKEY = "thisIsATempSecretKeyIAmUsingForTheBackEndApplication";

const saltRounds = 10;

const signupUser = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists, please choose an unique email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "New user created", user: newUser });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const loggedInUser = await User.findOne({ email });

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

const protectedRoute = async (req, res, next) => {
  const user = req.user;
  const welcomeUser = await User.findById(user);

  if (!welcomeUser) {
    return res.status(500).json("Internal Server Error");
  }

  return res
    .status(200)
    .json({
      message: `Welcome ${welcomeUser.firstName} to the protected route`,
    });
};

module.exports = {
  signupUser,
  loginUser,
  protectedRoute
};
