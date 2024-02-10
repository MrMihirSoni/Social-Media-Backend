const postRouter = require("express").Router();

const { allPosts, addPost, updatePost, deletePost } = require("../controllers/posts.controller");

postRouter.get("/", allPosts);
postRouter.post("/add", addPost);
postRouter.patch("/update/:id", updatePost);
postRouter.delete("/delete/:id", deletePost);

module.exports = postRouter;