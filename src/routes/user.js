const userRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const users = require("../models/UserModel");
const mongoose = require("mongoose");
const _ = require("lodash");
const multer = require("multer");
const { storage, fileFilter } = require("../utils/multer");

const upload = multer({ storage: storage, fileFilter });

userRoute.post("/login", async (req, res) => {
  user = await users.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ msg: "User Not Found" });
  }

  if (user.password !== req.body.password) {
    return res.status(401).json({ msg: "Incorrect password" });
  }

  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  return res.json({
    accessToken,
    email: user.email,
  });
});

userRoute.post("/register", upload.single("profileImage"), async (req, res) => {
  req.file ? (req.body.imageUrl = req.file.path) : (req.body.imageUrl = null);

  if (await users.findOne({ email: req.body.email })) {
    return res.status(409).json({ msg: "User already exists" });
  }
  await users.create(req.body, (err) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    return res.status(201).json({ msg: "User Created Successfully" });
  });
});

module.exports = userRoute;
