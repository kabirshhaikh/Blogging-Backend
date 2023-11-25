const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.post("/signup", userController.signupUser);

module.exports = router;
