const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['IT & Software', 'Construction', 'Manufacturing', 'Services', 'Healthcare', 'Education', 'Other']
  },
  budgetMin: {
    type: Number,
    required: [true, 'Minimum budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  budgetMax: {
    type: Number,
    required: [true, 'Maximum budget is required'],
    min: [0, 'Budget cannot be negative'],
    validate: {
      validator: function(value) {
        return value >= this.budgetMin;
      },
      message: 'Maximum budget must be greater than or equal to minimum budget'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  documents: [{
    url: String,
    name: String
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'awarded'],
    default: 'open'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  awardedBidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }
}, {
  timestamps: true
});

// Text index for search
tenderSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Tender', tenderSchema);
