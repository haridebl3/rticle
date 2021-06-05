const userRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const users = require("../models/UserModel");
const mongoose = require("mongoose");
const _ = require("lodash");
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
    process.env.JWT_SECRET
  );

  res.json({
    accessToken,
    email: user.email,
  });
});

userRoute.post("/register", async (req, res) => {
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

module.exports = userRoute;
