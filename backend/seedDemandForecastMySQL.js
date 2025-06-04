const mysql = require('mysql2/promise');

const products = ['tomato', 'potato', 'onion', 'rice', 'wheat'];
const today = new Date();

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TIGER', // <-- changed to empty string for no password
    database: 'agrotech'
  });

  await connection.query('DELETE FROM demand_forecast');

  for (const product of products) {
    // 7 days historical
    for (let i = 7; i > 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const actual = 100 + Math.floor(Math.random() * 30);
      await connection.query(
        `INSERT INTO demand_forecast (product, date, actual, forecast, upperBound, lowerBound, seasonalFactor, confidence)
         VALUES (?, ?, ?, 0, 0, 0, ?, 1)`,
        [product, formatDate(date), actual, 1 + Math.random() * 0.2]
      );
    }
    // 7 days forecast
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const forecast = 110 + Math.floor(Math.random() * 30);
      await connection.query(
        `INSERT INTO demand_forecast (product, date, actual, forecast, upperBound, lowerBound, seasonalFactor, confidence)
         VALUES (?, ?, 0, ?, ?, ?, ?, 0.95)`,
        [
          product,
          formatDate(date),
          forecast,
          forecast + 10,
          forecast - 10,
          1 + Math.random() * 0.2
        ]
      );
    }
  }

  await connection.end();
  console.log('Seeded demand forecast data for MySQL!');
}

seed().catch(err => {
  console.error(err);
}); 