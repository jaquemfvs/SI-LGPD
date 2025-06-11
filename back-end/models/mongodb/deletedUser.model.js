const mongoose = require("mongoose");

const deletedUser = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
});

module.exports = mongoose.model("deletedUser", deletedUser);
