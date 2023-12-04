const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const postsController = require("../Controller/postsController");
const isAuthorised = require("../Middlewear/jwtHelper");
const multer = require("../Middlewear/Multer");
const profilePictureMulter = require("../Middlewear/MulterProfilePicture");
const commentsController = require("../Controller/commentsController");
const likesController = require("../Controller/likesController");

//User Routes:
router.post(
  "/signup",
  profilePictureMulter.single("profilePicture"),
  userController.signupUser
);
router.post("/login", userController.loginUser);
router.get("/protected-route", isAuthorised, userController.protectedRoute);
router.get(
  "/get-all-posts-of-user/:userId",
  isAuthorised,
  userController.getAllPostsOfAUser
);

//Post's Routes:
router.post(
  "/create-post",
  isAuthorised,
  multer.single("postPicture"),
  postsController.createPost
);
router.delete("/delete-post/:id", isAuthorised, postsController.deletePost);
router.patch(
  "/update-post/:id",
  isAuthorised,
  multer.single("postPicture"),
  postsController.updatePost
);
router.get("/get-all-posts", isAuthorised, postsController.getAllPosts);

//Comments Route:
router.post(
  "/add-comment/:postId",
  isAuthorised,
  commentsController.addComment
);
router.patch(
  "/edit-comment/:postId/:commentId",
  isAuthorised,
  commentsController.editComment
);
router.delete(
  "/delete-comment/:postId/:commentId",
  isAuthorised,
  commentsController.deleteComment
);

router.get("/search-post", isAuthorised, postsController.searchPost);

//Likes Routes:
router.post("/add-like/:postId", isAuthorised, likesController.postLike);

module.exports = router;
