const User = require("../Model/User");
const bcrypt = require("bcrypt");

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

module.exports = {
  signupUser,
};
