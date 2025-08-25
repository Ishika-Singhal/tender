const express = require('express');
const {
  createBid,
  getMyBids,
  getTenderBids,
  decideBid
} = require('../controllers/bidController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

// Seller routes
router.post('/tender/:id', auth, requireRole('seller'), createBid);
router.get('/me', auth, requireRole('seller'), getMyBids);

// Buyer routes
router.get('/tender/:id', auth, requireRole('buyer'), getTenderBids);
router.post('/:bidId/decision', auth, requireRole('buyer'), decideBid);

module.exports = router;
