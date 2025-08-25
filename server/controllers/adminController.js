const User = require('../models/User');
const Tender = require('../models/Tender');
const Bid = require('../models/Bid');

// Get admin stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalTenders = await Tender.countDocuments();
    const openTenders = await Tender.countDocuments({ status: 'open' });
    const closedTenders = await Tender.countDocuments({ status: 'closed' });
    const awardedTenders = await Tender.countDocuments({ status: 'awarded' });
    const totalBids = await Bid.countDocuments();
    const pendingBids = await Bid.countDocuments({ status: 'pending' });
    const acceptedBids = await Bid.countDocuments({ status: 'accepted' });
    const rejectedBids = await Bid.countDocuments({ status: 'rejected' });

    res.json({
      users: {
        total: totalUsers,
        buyers: totalBuyers,
        sellers: totalSellers
      },
      tenders: {
        total: totalTenders,
        open: openTenders,
        closed: closedTenders,
        awarded: awardedTenders
      },
      bids: {
        total: totalBids,
        pending: pendingBids,
        accepted: acceptedBids,
        rejected: rejectedBids
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-passwordHash')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Block/Unblock user
const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot block admin user' });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin user' });
    }

    // Delete user's tenders and bids
    await Tender.deleteMany({ buyerId: userId });
    await Bid.deleteMany({ sellerId: userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tender
const deleteTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const tender = await Tender.findById(tenderId);

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    // Delete associated bids
    await Bid.deleteMany({ tenderId });
    await Tender.findByIdAndDelete(tenderId);

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleUserBlock,
  deleteUser,
  deleteTender
};
