const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_dev', // The name of the folder in cloudinary
    allowerdFormat: ['jpeg', 'png', 'jpg',] // Allowed formats

  },
});

module.exports = {
  cloudinary: cloudinary,
  storage: storage
};