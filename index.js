const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const UserModel = require("./schema/user");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL);
// User Signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = { email, password };
    const newUser = new UserModel(user);
    await newUser.save();

    console.log(newUser);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

//

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let data = await UserModel.findOne({ email: email });
    if (data?.email == email && data?.password == password) {
      res.status(200).json({ data });
    } else {
      res.status(400).json("invalid cred");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});
app.listen(9000, () => {
  console.log(`Server is running successfully on port ${9000}`);
});
