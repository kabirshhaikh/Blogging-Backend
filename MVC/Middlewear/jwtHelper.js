const jwt = require("jsonwebtoken");
const SECRETKEY = "thisIsATempSecretKeyIAmUsingForTheBackEndApplication";
const User = require("../Model/User");

const authenticateTheUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorised" });
  }

  try {
    const decodedToken = jwt.verify(token, SECRETKEY);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticateTheUser;
