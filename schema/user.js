const mongoose = require("mongoose");

const usersLogin = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  forgotpassword: {
    type: Number,
    required: false,
  },
});

const users = mongoose.model("users", usersLogin);

module.exports = users;
