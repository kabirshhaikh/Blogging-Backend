const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const isAuthorised = require("../Middlewear/jwtHelper");

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.get("/protected-route", isAuthorised, userController.protectedRoute);

module.exports = router;
