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
    res.status(404).send("User Not Found");
  }

  if (user.password !== req.body.password) {
    res.status(401).send("Incorrect password");
  }

  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  res.json({
    accessToken,
    email: user.email,
  });
});

userRoute.post("/register", upload.single("profileImage"), async (req, res) => {
  req.file ? (req.body.imageUrl = req.file.path) : (req.body.imageUrl = null);
  if (await users.findOne({ email: req.body.email })) {
    res.status(409).send("User already exists");
  }
  await users.create(req.body, (err) => {
    if (err) {
      res.send(err);
    }
    res.status(201).send("User Created Successfully");
  });
});

userRoute.get("/register", async (req, res) => {
  res.status(200).json(await users.find({}));
});

module.exports = userRoute;
