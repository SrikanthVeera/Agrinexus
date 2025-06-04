const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'seeds', 'fertilizers']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'pcs']
  },
  qualityGrade: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  supplier: {
    type: String,
    required: true,
    trim: true
  },
  threshold: {
    type: Number,
    default: 10
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  history: [{
    action: {
      type: String,
      enum: ['added', 'updated', 'deleted', 'quality_changed']
    },
    quantity: Number,
    qualityGrade: String,
    date: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
inventorySchema.index({ name: 1, category: 1 });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ qualityGrade: 1 });

// Pre-save middleware to update history
inventorySchema.pre('save', function(next) {
  if (this.isModified()) {
    const historyEntry = {
      action: this.isNew ? 'added' : 'updated',
      quantity: this.quantity,
      qualityGrade: this.qualityGrade,
      updatedBy: this.updatedBy
    };
    this.history.push(historyEntry);
  }
  next();
});

// Method to check if item is expiring soon
inventorySchema.methods.isExpiringSoon = function(days = 7) {
  const expiryDate = new Date(this.expiryDate);
  const today = new Date();
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

// Method to check if stock is low
inventorySchema.methods.isLowStock = function() {
  return this.quantity <= this.threshold;
};

// Static method to find expiring items
inventorySchema.statics.findExpiringItems = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return this.find({
    expiryDate: { $lte: date }
  });
};

// Static method to find low stock items
inventorySchema.statics.findLowStockItems = function() {
  return this.find({
    $expr: { $lte: ['$quantity', '$threshold'] }
  });
};

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory; 