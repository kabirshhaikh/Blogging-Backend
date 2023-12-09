const jwt = require("jsonwebtoken");
const SECRETKEY = "thisIsATempSecretKeyIAmUsingForTheBackEndApplication";
const User = require("../Model/User");

const authenticateTheUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const tokenWithoutBearer = token.replace("Bearer ", "");
  console.log("Recieved token:" + token);

  try {
    const decodedToken = jwt.verify(tokenWithoutBearer, SECRETKEY);
    console.log("Decoded token:", decodedToken);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorised" });
    }

    //Set the user in req:
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticateTheUser;
