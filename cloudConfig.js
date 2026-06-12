const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  //This is where we set up our Cloudinary configuration using environment variables for security
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // This is the folder in Cloudinary where your images will be stored
    // supports promises as well
    allowedFormats: ['jpeg', 'png', 'jpg', 'gif'], // This restricts the types of files that can be uploaded
  },
});

module.exports = {
  cloudinary,
  storage,
};
