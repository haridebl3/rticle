var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BufferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, unique: true, required: true },
    category: { type: String, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: "UserSchema" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Buffer", BufferSchema);
