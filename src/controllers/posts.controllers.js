const PostModel = require("../models/post.model");

const allPosts = async (req, res) => {
  const { device } = req.query;
  try {
    let data = [];
    if (device) {
      data = await PostModel.find({ userId: req.body.userId, device: device });
    } else {
      data = await PostModel.find({ userId: req.body.userId });
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addPost = async (req, res) => {
  const { title, body, userId } = req.body;
  const device = req.device.type;
  try {
    if (!title || !body) throw new Error("please fill all boxes!");
    else {
      const newPost = new PostModel({
        title,
        body,
        device,
        userId,
      });
      await newPost.save();
      res.status(201).json({ data: newPost });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const data = req.body;
  try {
    const postToUpdate = await PostModel.findOne({ _id: postId });
    if (!postToUpdate) throw new Error("Enter valid post id!");
    else {
      if (req.body.userId !== postToUpdate.userId)
        throw new Error(
          "You are not authorised to update someone else's post!"
        );
      else {
        await PostModel.findByIdAndUpdate(postId, data);
        res.status(201).json({ message: "post updated!" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const postToDelete = await PostModel.findOne({ _id: postId });
    if (!postToDelete) throw new Error("Enter valid post id!");
    else {
      if (req.body.userId !== postToDelete.userId)
        throw new Error(
          "You are not authorised to delete someone else's post!"
        );
      else {
        await PostModel.findByIdAndDelete(postId);
        res.status(200).json({ message: "post removed!" });
      }
    }
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { allPosts, addPost, deletePost, updatePost };
