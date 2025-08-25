const express = require('express');
const {
  getStats,
  getUsers,
  toggleUserBlock,
  deleteUser,
  deleteTender
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const router = express.Router();

// All admin routes require admin role
router.use(auth);
router.use(requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:userId/toggle-block', toggleUserBlock);
router.delete('/users/:userId', deleteUser);
router.delete('/tenders/:tenderId', deleteTender);

module.exports = router;
