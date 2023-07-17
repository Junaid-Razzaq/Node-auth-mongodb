const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const UserModel = require("./schema/user");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "junaidrazzaq112@gmail.com",
    pass: "wntniukcaqywgknl",
  },
});
mongoose.connect(process.env.MONGODB_URL);
// User Signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ error: "Email already exists" });
    }
    const user = { email, password, role: "candidate" };
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
    let data = await UserModel.findOne({ email: email, password: password });
    if (data?.email == email && data?.password == password) {
      res.status(200).json({ data });
    } else {
      res.status(400).json("invalid cred");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

app.post("/forgot-pass", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    let data = await UserModel.findOne({ email: email });
    if (data?.email) {
      let code = Math.random();
      let setCode = await UserModel.updateOne(
        { _id: data?._id },
        { $set: { forgotpassword: 6944 } }
      );
      console.log(setCode);
      let mailOptions = {
        from: "junaidrazzaq112@gmail.com",
        to: "vanilaprogram@gmail.com",
        subject: "Forgot Password code",
        text: `reset code is ${6944}`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json("Email sent SuccessFully");
        }
      });
    }
  } catch (e) {
    res.status(500).json(e);
  }
});
app.post("/changepassword", async (req, res) => {
  const { password, resetcode } = req.body;
  try {
    let match = await UserModel.findOne({ forgotpassword: resetcode });
    console.log(match);
    if (match?.forgotpassword) {
      let setCode = await UserModel.updateOne(
        { forgotpassword: match?.forgotpassword },
        { $set: { password: password } }
      );
      res.status(200).json("Password changed successfully");
    } else {
      res.status(401).json("Error: while updating password");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});
app.listen(9000, () => {
  console.log(`Server is running successfully on port ${9000}`);
});
//
