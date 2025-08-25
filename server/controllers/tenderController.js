const Tender = require('../models/Tender');
const Bid = require('../models/Bid');
const Notification = require('../models/Notification');

// Get all tenders (public)
const getTenders = async (req, res) => {
  try {
    const {
      q,
      category,
      status = 'open',
      page = 1,
      limit = 10,
      sort = '-createdAt',
      minBudget,
      maxBudget,
      location
    } = req.query;

    const query = {};
    
    // Search query
    if (q) {
      query.$text = { $search: q };
    }

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (location) query.location = new RegExp(location, 'i');
    
    // Budget range
    if (minBudget || maxBudget) {
      query.$and = [];
      if (minBudget) query.$and.push({ budgetMax: { $gte: Number(minBudget) } });
      if (maxBudget) query.$and.push({ budgetMin: { $lte: Number(maxBudget) } });
    }

    const skip = (page - 1) * limit;
    
    const tenders = await Tender.find(query)
      .populate('buyerId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Tender.countDocuments(query);

    res.json({
      tenders,
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

// Get tender by ID
const getTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate('buyerId', 'name email');

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    res.json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create tender (buyer only)
const createTender = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      location,
      deadline,
      documents = []
    } = req.body;

    const tender = await Tender.create({
      buyerId: req.user._id,
      title,
      description,
      category,
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      location,
      deadline: new Date(deadline),
      documents
    });

    const populatedTender = await Tender.findById(tender._id)
      .populate('buyerId', 'name email');

    res.status(201).json(populatedTender);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update tender (buyer owner only)
const updateTender = async (req, res) => {

  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    if (tender.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (tender.status !== 'open') {
      return res.status(400).json({ error: 'Cannot update closed or awarded tender' });
    }

    const updatedTender = await Tender.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    ).populate('buyerId', 'name email');

    res.json(updatedTender);

    console.log("hello");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Close tender
const closeTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    if (tender.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (tender.status !== 'open') {
      return res.status(400).json({ error: 'Tender is already closed or awarded' });
    }

    tender.status = 'closed';
    await tender.save();

    // Reject all pending bids
    await Bid.updateMany(
      { tenderId: tender._id, status: 'pending' },
      { status: 'rejected' }
    );

    res.json({ message: 'Tender closed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tender (optional)
const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    if (tender.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete associated bids
    await Bid.deleteMany({ tenderId: tender._id });
    await Tender.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTenders,
  getTender,
  createTender,
  updateTender,
  closeTender,
  deleteTender
};
