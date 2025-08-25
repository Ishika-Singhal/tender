const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [0, 'Bid amount cannot be negative']
  },
  proposal: {
    type: String,
    required: [true, 'Proposal is required'],
    trim: true,
    maxlength: [1000, 'Proposal cannot exceed 1000 characters']
  },
  attachments: [{
    url: String,
    name: String
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure one bid per seller per tender
bidSchema.index({ tenderId: 1, sellerId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
