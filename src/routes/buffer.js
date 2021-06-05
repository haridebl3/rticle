const bufferRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const buffers = require("../models/BufferModel");
const { authenticateUser } = require("../authentication");

bufferRoute.get("/", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    res.status("403");
  }
  res.status(200).json(await buffers.find({}));
});

bufferRoute.post("/", authenticateUser, async (req, res) => {
  var bufferArticle = req.body;
  bufferArticle.user = req.user.id;

  await buffers.create(bufferArticle, (err) => {
    if (err) {
      res.send(err);
    }
    res
      .status(201)
      .send("Article posted successfully and waiting for admin approval");
  });
});
bufferRoute.delete("/:id", authenticateUser, async (req, res) => {
  await buffers.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.send(err);
    }
    res.status(200).send("Article Deleted Successfully");
  });
});

module.exports = bufferRoute;
