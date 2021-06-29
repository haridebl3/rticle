const articleRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const articles = require("../models/ArticleModel");
const buffers = require("../models/BufferModel");
const { authenticateUser } = require("../authentication");

articleRoute.post("/approve", authenticateUser, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(status_codes.UNAUTHORIZED).json({ msg: "Unauthorized" });
  }
  bufferId = req.body.id;
  var buffer = await buffers
    .findById(bufferId, (err, buffer) => {
      if (err) {
        return res
          .status(status_codes.NOT_FOUND)
          .json({ msg: "Buffer Item Doesnot exist" });
      }
      return buffer;
    })
    .select({ createdAt: 0, updatedAt: 0, _id: 0, __v: 0 })
    .exec();
  if (!buffer) {
    return res
      .status(status_codes.NOT_FOUND)
      .json({ msg: "Buffered Article Not found" });
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
      return res
        .status(status_codes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Cannot able to create article" });
    }
    buffers.findByIdAndRemove(bufferId, (err) => {
      if (err) {
        return res
          .status(status_codes.INTERNAL_SERVER_ERROR)
          .json({ msg: "cannot remove article from buffer" });
      }
      return res
        .status(status_codes.OK)
        .json({ id: article._id, msg: "Article approved successfully" });
    });
  });
});

articleRoute.get("/:id", async (req, res) => {
  var article = await articles.findById(req.params.id, (err) => {
    if (err) {
      return res.status(status_codes.INTERNAL_SERVER_ERROR).json({ msg: err });
    }
  });
  if (!article) {
    return res
      .status(status_codes.NOT_FOUND)
      .json({ msg: "Article Not found" });
  }
  await articles.findByIdAndUpdate(
    req.params.id,
    { views: article.views + 1 },
    (err) => {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({ msg: err });
      }
    }
  );
  return res.status(status_codes.OK).json(article);
});

articleRoute.get("/", (req, res) => {
  filter = req.query.filter;
  articles
    .find({}, (err, article) => {
      if (err) {
        return res
          .status(status_codes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Error Fetching details" });
      }
      return res.status(status_codes.OK).json(article);
    })
    .sort(filter);
});
module.exports = articleRoute;
