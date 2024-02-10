const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const device = require("express-device")
const connection = require("./configs/db");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/posts.routes");
const auth = require("./middlewares/auth.middleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin:["https://kind-jade-chicken-tutu.cyclic.app", "http://localhost:5173"],
  credentials:true
}));
app.use(cookieParser());
app.use(device.capture());
app.use("/users", userRouter);
app.use("/posts", auth, postRouter)

app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to My new Social Media App!" });
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${PORT} and DB is also connected`);
  } catch (error) {}
});