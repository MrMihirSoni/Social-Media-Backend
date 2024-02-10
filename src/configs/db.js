const mongoose = require("mongoose");
require("dotenv").config();
const collection = mongoose.connect(process.env.MONGO_URI);
module.exports = collection;