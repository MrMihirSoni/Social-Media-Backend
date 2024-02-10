const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const BlackListModel = require("../models/blacklist.model");

const register = async (req, res) => {
  const { name, email, password, gender } = req.body;
  try {
    if(!name || !email || !password || !gender) throw new Error("fill all details!")
    if (await UserModel.findOne({ email }))
      throw new Error("email already exists!");
    else {
      if (password.length < 8)
        throw new Error("password must contain atleast 8 charectors!");
      else {
        bcrypt.hash(password, 7, async (err, hash) => {
          if (err)
            throw new Error("Something went wrong while hashing the password!");
          else {
            const newUser = new UserModel({
              name,
              email,
              password: hash,
              gender,
            });
            await newUser.save();
            res.status(201).json({
              message: "New user has been created!",
              newUserDetails: newUser,
            });
          }
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("You need to register first!");
    else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const accessToken = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {
              expiresIn: "1d",
            }
          );
          const refreshToken = jwt.sign(
            { userId: user._id, userName: user.userName },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            {
              expiresIn: "7d",
            }
          );
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.status(200).send({
            msg: "Login successful!",
            token: accessToken,
            refreshToken: refreshToken,
          });
        } else res.status(400).json({ error: "Wrong password!" });
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  try {
    if (await BlackListModel.findOne({ accessToken }))
      throw new Error("You are already Logged out!");
    else {
      const blackListUser = new BlackListModel({ accessToken });
      await blackListUser.save();
      res.status(200).json({ msg: "User has been logged out!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, logout };