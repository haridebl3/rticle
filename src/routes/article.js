const articleRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const articles = require("../models/ArticleModel");
const buffers = require("../models/BufferModel");
const { authenticateUser } = require("../authentication");

articleRoute.post("/approve", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(401).send("Unauthorized");
  }
  bufferId = req.body.id;
  var buffer = await buffers
    .findById(bufferId, (err, buffer) => {
      if (err) {
        res.status(404).send("Buffer Item Doesnot exist");
      }
      return buffer;
    })
    .select({ createdAt: 0, updatedAt: 0, _id: 0, __v: 0 })
    .exec();
  if (!buffer) {
    res.status(404).send("Buffered Article Not found");
  }

  var bufferedArticle = (({
    title,
    author,
    content,
    category,
    keywords,
    user,
  }) => ({ title, author, content, category, keywords, user }))(buffer);
  bufferedArticle.views = 0;
  const article = await articles.create(bufferedArticle, (err, article) => {
    if (err) {
      res.status(500).send("Cannot able to create article");
    }
    buffers.findByIdAndRemove(bufferId, (err) => {
      if (err) {
        res.send("cannot remove article from buffer");
      }
      res
        .status(200)
        .json({ id: article._id, msg: "Article approved successfully" });
    });
  });
});

articleRoute.get("/:id", async (req, res) => {
  var article = await articles.findById(req.params.id, (err) => {
    if (err) {
      res.send(err);
    }
  });
  if (!article) {
    res.status(404).send("Article Not found");
  }
  await articles.findByIdAndUpdate(
    req.params.id,
    { views: article.views + 1 },
    (err) => {
      if (err) {
        res.send(err);
      }
    }
  );
  res.status(200).json(article);
});

articleRoute.get("/", (req, res) => {
  filter = req.query.filter;
  articles.find({}, (err, article) => {
    if (err) {
      res.status(400).send("Error Fetching details");
    }
    res.status(200).send(article);
  }).sort(filter);
});
module.exports = articleRoute;
