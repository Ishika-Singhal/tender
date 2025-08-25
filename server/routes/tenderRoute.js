const express = require('express');
const {
  getTenders,
  getTender,
  createTender,
  updateTender,
  closeTender,
  deleteTender
} = require('../controllers/tenderController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

// Public routes
router.get('/', getTenders);
router.get('/:id', getTender);

// Protected routes
router.post('/', auth, requireRole('buyer'), createTender);
router.patch('/:id/update', auth, requireRole('buyer'), updateTender);
router.post('/:id/close', auth, requireRole('buyer'), closeTender);
router.delete('/:id', auth, requireRole('buyer'), deleteTender);

module.exports = router;
