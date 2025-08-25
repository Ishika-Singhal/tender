const { cloudinary } = require('../config/cloudinary');

// Get Cloudinary info for frontend uploads
const getCloudinaryInfo = async (req, res) => {
  try {
    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: 'tender-infinity', // You'll need to create this preset in Cloudinary
      apiKey: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate signed upload parameters (alternative approach)
const getSignedUploadParams = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp,
      folder: 'tender-infinity',
      resource_type: 'auto'
    };

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

    res.json({
      ...params,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCloudinaryInfo,
  getSignedUploadParams
};
