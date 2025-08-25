const express = require('express');
const { getCloudinaryInfo, getSignedUploadParams } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/cloudinary-info', auth, getCloudinaryInfo);
router.get('/signed-params', auth, getSignedUploadParams);

module.exports = router;
