const Bid = require('../models/Bid');
const Tender = require('../models/Tender');
const Notification = require('../models/Notification');

// Create bid (seller only)
const createBid = async (req, res) => {
  try {
    const { amount, proposal, attachments = [] } = req.body;
    const tenderId = req.params.id;

    // Check if tender exists and is open
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    if (tender.status !== 'open') {
      return res.status(400).json({ error: 'Tender is not open for bidding' });
    }

    if (new Date() > tender.deadline) {
      return res.status(400).json({ error: 'Tender deadline has passed' });
    }

    // Check if seller already bid
    const existingBid = await Bid.findOne({
      tenderId,
      sellerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({ error: 'You have already bid on this tender' });
    }

    // Create bid
    const bid = await Bid.create({
      tenderId,
      sellerId: req.user._id,
      amount: Number(amount),
      proposal,
      attachments
    });

    // Create notification for buyer
    await Notification.create({
      userId: tender.buyerId,
      type: 'bid_received',
      data: {
        bidId: bid._id,
        tenderId,
        sellerName: req.user.name,
        tenderTitle: tender.title
      }
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('sellerId', 'name email')
      .populate('tenderId', 'title');

    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get my bids (seller)
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ sellerId: req.user._id })
      .populate('tenderId', 'title status deadline')
      .sort('-createdAt');

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bids for tender (buyer owner)
const getTenderBids = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    if (tender.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const bids = await Bid.find({ tenderId: req.params.id })
      .populate('sellerId', 'name email')
      .sort('-createdAt');

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept/Reject bid (buyer owner)
const decideBid = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const bidId = req.params.bidId;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const bid = await Bid.findById(bidId).populate('tenderId');
    
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const tender = bid.tenderId;

    if (tender.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({ error: 'Bid has already been decided' });
    }

    if (tender.status !== 'open') {
      return res.status(400).json({ error: 'Tender is not open' });
    }

    if (action === 'accept') {
      // Accept this bid
      bid.status = 'accepted';
      await bid.save();

      // Award tender
      tender.status = 'awarded';
      tender.awardedBidId = bid._id;
      await tender.save();

      // Reject all other pending bids
      await Bid.updateMany(
        { tenderId: tender._id, _id: { $ne: bid._id }, status: 'pending' },
        { status: 'rejected' }
      );

      // Create notification for accepted seller
      await Notification.create({
        userId: bid.sellerId,
        type: 'bid_accepted',
        data: {
          bidId: bid._id,
          tenderId: tender._id,
          tenderTitle: tender.title
        }
      });

      // Create notifications for rejected sellers
      const rejectedBids = await Bid.find({
        tenderId: tender._id,
        _id: { $ne: bid._id },
        status: 'rejected'
      });

      for (const rejectedBid of rejectedBids) {
        await Notification.create({
          userId: rejectedBid.sellerId,
          type: 'bid_rejected',
          data: {
            bidId: rejectedBid._id,
            tenderId: tender._id,
            tenderTitle: tender.title
          }
        });
      }

    } else {
      // Reject this bid
      bid.status = 'rejected';
      await bid.save();

      // Create notification for rejected seller
      await Notification.create({
        userId: bid.sellerId,
        type: 'bid_rejected',
        data: {
          bidId: bid._id,
          tenderId: tender._id,
          tenderTitle: tender.title
        }
      });
    }

    res.json({ message: `Bid ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBid,
  getMyBids,
  getTenderBids,
  decideBid
};
