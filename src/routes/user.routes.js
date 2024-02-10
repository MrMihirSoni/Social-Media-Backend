const userRouter = require("express").Router();

const { register, login, logout } = require("../controllers/user.controllers");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);

module.exports = userRouter;