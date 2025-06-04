const mongoose = require('mongoose');
const DemandForecast = require('./models/DemandForecast');

const uri = 'mongodb://localhost:27017/agritech'; // <-- update with your DB name if different

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const today = new Date();
const data = [];

// 7 days historical
for (let i = 7; i > 0; i--) {
  data.push({
    product: 'tomato',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i),
    actual: 100 + Math.floor(Math.random() * 20),
    forecast: 0,
    upperBound: 0,
    lowerBound: 0,
    seasonalFactor: 1 + Math.random() * 0.2,
    confidence: 1,
    factors: {},
    metadata: {}
  });
}

// 7 days forecast
for (let i = 1; i <= 7; i++) {
  const forecast = 110 + Math.floor(Math.random() * 20);
  data.push({
    product: 'tomato',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
    actual: 0,
    forecast,
    upperBound: forecast + 10,
    lowerBound: forecast - 10,
    seasonalFactor: 1 + Math.random() * 0.2,
    confidence: 0.95,
    factors: {},
    metadata: {}
  });
}

DemandForecast.insertMany(data)
  .then(() => {
    console.log('Seeded demand forecast data!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  }); 