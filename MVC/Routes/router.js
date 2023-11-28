const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const postsController = require("../Controller/postsController");
const isAuthorised = require("../Middlewear/jwtHelper");

//User Routes:
router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);
router.get("/protected-route", isAuthorised, userController.protectedRoute);

//Post's Routes:
router.post("/create-post", isAuthorised, postsController.createPost);
router.delete("/delete-post/:id", isAuthorised, postsController.deletePost);
router.patch("/update-post/:id", isAuthorised, postsController.updatePost);

module.exports = router;
