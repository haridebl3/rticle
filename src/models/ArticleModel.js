var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, unique: true, required: true },
    category: {
      type: String,
      enum: ["Tech", "Non-Tech"],
      default: "Tech",
    },
    keywords: { type: Array, default: [] },
    user: [{ type: Schema.Types.ObjectId, ref: "UserSchema" }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);