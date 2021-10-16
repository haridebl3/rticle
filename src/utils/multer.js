const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../../src/images"));
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
    return callback(new Error("only upload files with jpg, jpeg,png  format."));
  }
  callback(undefined, true);
};

module.exports = { storage: storage, fileFilter: fileFilter };
