const bufferRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const buffers = require("../models/BufferModel");
const { authenticateUser } = require("../authentication");
const { status_codes } = require("http-status-codes");

bufferRoute.get("/", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(status_codes.UNAUTHORIZED).json({ msg: "unauthorized" });
  }
  return res.status(status_codes.OK).json(await buffers.find({}));
});

bufferRoute.post("/", authenticateUser, async (req, res) => {
  var bufferArticle = req.body;
  bufferArticle.user = req.user.id;

  await buffers.create(bufferArticle, (err) => {
    if (err) {
      return res.status(status_codes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
    return res.status(status_codes.CREATED).json({
      msg: "Article posted successfully and waiting for admin approval",
    });
  });
});
bufferRoute.delete("/:id", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(status_codes.UNAUTHORIZED).json({ msg: "unauthorized" });
  }
  await buffers.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.status(status_codes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
    return res
      .status(status_codes.NO_CONTENT)
      .json({ msg: "Article Deleted Successfully" });
  });
});

module.exports = bufferRoute;
