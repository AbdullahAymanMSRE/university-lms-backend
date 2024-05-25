const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};
const getFile = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};
const deleteFile = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
};
