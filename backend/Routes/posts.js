const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require("../controllers/posts");
const  extractFile = require("../middleware/file");



router.post("",checkAuth, extractFile, UserController.createPosts);

router.get("", UserController.getPosts);

router.delete("/:id",checkAuth, UserController.deletePost);

router.get("/:id", UserController.getPost);

router.put("/:id",extractFile, UserController.updatePost);

module.exports = router;
