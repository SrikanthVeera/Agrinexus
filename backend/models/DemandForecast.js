const mongoose = require('mongoose');

const demandForecastSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  actual: {
    type: Number,
    required: true
  },
  forecast: {
    type: Number,
    required: true
  },
  upperBound: {
    type: Number,
    required: true
  },
  lowerBound: {
    type: Number,
    required: true
  },
  seasonalFactor: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  factors: {
    weather: {
      type: Number,
      default: 0
    },
    marketTrend: {
      type: Number,
      default: 0
    },
    seasonality: {
      type: Number,
      default: 0
    },
    events: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    algorithm: {
      type: String,
      default: 'ARIMA'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
demandForecastSchema.index({ product: 1, date: 1 });
demandForecastSchema.index({ date: 1 });

// Method to calculate forecast accuracy
demandForecastSchema.methods.calculateAccuracy = function() {
  if (this.actual && this.forecast) {
    const error = Math.abs(this.actual - this.forecast);
    return 1 - (error / this.actual);
  }
  return null;
};

// Static method to get forecast insights
demandForecastSchema.statics.getInsights = async function(product, timeframe) {
  const forecasts = await this.find({ product })
    .sort({ date: -1 })
    .limit(timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : timeframe === 'quarter' ? 90 : 365);

  const insights = [];
  
  // Calculate trend
  const recentForecasts = forecasts.slice(0, 7);
  const trend = recentForecasts.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return 0;
    return acc + (curr.forecast - arr[idx - 1].forecast);
  }, 0) / (recentForecasts.length - 1);

  if (trend > 0) {
    insights.push(`Demand is trending upward with an average increase of ${trend.toFixed(2)} units per period`);
  } else if (trend < 0) {
    insights.push(`Demand is trending downward with an average decrease of ${Math.abs(trend).toFixed(2)} units per period`);
  }

  // Calculate seasonality
  const seasonalPattern = forecasts.reduce((acc, curr) => {
    const month = new Date(curr.date).getMonth();
    acc[month] = (acc[month] || 0) + curr.seasonalFactor;
    return acc;
  }, {});

  const maxSeasonalMonth = Object.entries(seasonalPattern)
    .reduce((a, b) => a[1] > b[1] ? a : b);
  
  insights.push(`Strongest seasonal demand occurs in ${new Date(2000, maxSeasonalMonth[0]).toLocaleString('default', { month: 'long' })}`);

  // Calculate confidence
  const avgConfidence = forecasts.reduce((acc, curr) => acc + curr.confidence, 0) / forecasts.length;
  insights.push(`Forecast confidence is ${(avgConfidence * 100).toFixed(1)}%`);

  return insights;
};

const DemandForecast = mongoose.model('DemandForecast', demandForecastSchema);

module.exports = DemandForecast; 