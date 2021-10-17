const bufferRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const buffers = require("../models/BufferModel");
const { authenticateUser } = require("../authentication");
const multer = require("multer");
const { storage, fileFilter } = require("../utils/multer");

const serverUrl = "http://localhost:4000";

const upload = multer({ storage: storage, fileFilter });

bufferRoute.get("/", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ msg: "unauthorized" });
  }
  return res.status(200).json(await buffers.find({}));
});

bufferRoute.post(
  "/",
  authenticateUser,
  upload.single("coverPicUrl"),
  async (req, res) => {
    req.file
      ? (req.body.coverPicUrl = `${serverUrl}/images/${req.file.path
          .split("/")
          .slice()
          .pop()}`)
      : (req.body.imageUrl = null);
    var bufferArticle = req.body;
    bufferArticle.user = req.user.id;

    await buffers.create(bufferArticle, (err) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }
      return res.status(201).json({
        msg: "Article posted successfully and waiting for admin approval",
      });
    });
  }
);
bufferRoute.delete("/:id", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ msg: "unauthorized" });
  }
  await buffers.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ msg: err });
    }
    return res.status(204).json({ msg: "Article Deleted Successfully" });
  });
});

module.exports = bufferRoute;
