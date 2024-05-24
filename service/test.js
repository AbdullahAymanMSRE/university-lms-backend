const express = require("express");
const router = express.Router();
const { uploadMedia } = require("./cloudinary");
const upload = require("./multer");
// Handle file upload
router.post("/upload", (req, res) => {
  // Check if file exists in the request
  upload(req, res, (err) => {
    if (err) {
      res.send("Error uploading file");
    } else {
      res.send("File uploaded");
    }
  });
});

module.exports = router;
