const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const maxFileSize = 10 * 1024 * 1024;
const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
}).single("myFile");

module.exports = upload;
