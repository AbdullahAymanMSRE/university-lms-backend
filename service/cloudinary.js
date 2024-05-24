// require("dotenv").config();
// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
// const config = require("../configuration");

// const cloudName = config.CLOUDINARY_CLOUD_NAME;
// const apiKey = config.CLOUDINARY_API_KEY;
// const apiSecret = config.CLOUDINARY_SECRET_KEY;

// cloudinary.config({
//   cloud_name: cloudName,
//   api_key: apiKey,
//   api_secret: apiSecret,
// });

// const uploadMedia = function (file, fileType) {
//   return new Promise((resolve, reject) => {
//     const resourceType = fileType === "image" ? "image" : "video";
//     cloudinary.uploader.upload(
//       file.path,
//       {
//         folder: "uploads",
//         public_id: file.filename,
//         resource_type: resourceType,
//       },
//       (error, result) => {
//         if (error) {
//           console.error("An error occurred:", error);
//           reject(error);
//         } else {
//           console.log(result);
//           resolve(result);
//         }
//       }
//     );
//   });
// };

// const downloadMedia = function (fileKey) {
//   const url = cloudinary.url(fileKey);
//   return url;
// };

// module.exports = {
//   uploadMedia,
//   downloadMedia,
// };
