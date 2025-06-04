const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const marketPriceSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    default: 'kg'
  },
  priceHistory: [priceHistorySchema],
  marketTrend: {
    type: String,
    enum: ['rising', 'falling', 'stable'],
    default: 'stable'
  },
  supplyStatus: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  demandStatus: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  weatherImpact: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
marketPriceSchema.index({ product: 1, location: 1 });
marketPriceSchema.index({ updatedAt: -1 });

// Calculate average price
marketPriceSchema.methods.calculateAveragePrice = function() {
  if (this.priceHistory.length === 0) return this.price;
  const sum = this.priceHistory.reduce((acc, curr) => acc + curr.price, 0);
  return sum / this.priceHistory.length;
};

// Update market trend
marketPriceSchema.methods.updateMarketTrend = function() {
  if (this.priceHistory.length < 2) return;
  
  const recentPrices = this.priceHistory.slice(-5);
  const trend = recentPrices.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return acc;
    return acc + (curr.price - arr[idx - 1].price);
  }, 0);

  if (trend > 0) this.marketTrend = 'rising';
  else if (trend < 0) this.marketTrend = 'falling';
  else this.marketTrend = 'stable';
};

// Pre-save middleware to update trend
marketPriceSchema.pre('save', function(next) {
  this.updateMarketTrend();
  next();
});

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

module.exports = MarketPrice; 