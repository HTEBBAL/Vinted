const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  console.log("test");
  try {
    const password = req.fields.password;

    const users = await User.findOne({ email: req.fields.email });

    const salt = uid2(16);

    const hash = SHA256(password + salt).toString(encBase64);

    if (!users) {
      if (req.fields.username) {
        const newUser = await new User({
          salt: salt,
          token: uid2(16),
          hash: hash,
          email: req.fields.email,

          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
        });

        let pictureToUpload = req.files.username_photo.path;
        let result = await cloudinary.uploader.upload(pictureToUpload, {
          folder: `/vinted/profil/ ${newUser._id}`,
        });
        newUser.user_image = result;

        await newUser.save();

        res.status(200).json({
          _id: newUser._id,
          token: newUser.token,
          account: {
            username: newUser.account.username,
            phone: newUser.account.phone,
          },
        });
      } else {
        res.json("add username please");
      }
    } else {
      res.json("already email existing");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/user/login", async (req, res) => {
  try {
    const password = req.fields.password;
    let users = await User.find({ email: req.fields.email });
    console.log(users[0]);
    if (users[0]) {
      users = users[0];

      const salt = users.salt;
      const hash = SHA256(password + salt).toString(encBase64);
      if (hash === users.hash) {
        res.status(200).json({
          _id: users._id,
          token: users.token,
          account: {
            username: users.account.username,
            phone: users.account.phone,
          },
        });
      } else {
        res.status(400).json("password invalid");
      }
    } else {
      res.status(400).json("email invalid");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
