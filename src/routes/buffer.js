const bufferRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const buffer = require("../models/BufferModel");
const { authenticateUser } = require("../authentication");
const mongoose = require("mongoose");
const _ = require("lodash");

bufferRoute.get("/", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    res.status("403");
  }
  res.status(200).json(await buffer.find({}));
});

bufferRoute.post("/", authenticateUser, async (req, res) => {
  var bufferArticle = req.body;
  bufferArticle.user = req.user.id;

  await buffer.create(bufferArticle, (err) => {
    if (err) {
      res.send(err);
    }
    res
      .status(201)
      .send("Article posted successfully and waiting for admin approval");
  });
});

module.exports = bufferRoute;
