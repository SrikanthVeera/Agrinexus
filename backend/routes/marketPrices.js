const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
require('dotenv').config();

// Update with your MySQL config
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agritech',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all market prices with search
router.get('/', async (req, res) => {
  try {
    const { search, location, sort = 'updated_at', order = 'DESC' } = req.query;
    let sql = 'SELECT * FROM market_prices';
    const params = [];

    if (search || location) {
      sql += ' WHERE';
      if (search) {
        sql += ' product LIKE ?';
        params.push(`%${search}%`);
      }
      if (location) {
        sql += search ? ' AND' : '';
        sql += ' location LIKE ?';
        params.push(`%${location}%`);
      }
    }

    sql += ` ORDER BY ${sort} ${order} LIMIT 100`;
    const [prices] = await pool.query(sql, params);
    res.json(prices);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({ message: 'Failed to fetch market prices' });
  }
});

// Get real-time price for a specific product
router.get('/live/:product', async (req, res) => {
  try {
    const [prices] = await pool.query(
      'SELECT * FROM market_prices WHERE product = ? ORDER BY updated_at DESC LIMIT 1',
      [req.params.product]
    );
    
    if (prices.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('priceUpdate', prices[0]);
    }

    res.json(prices[0]);
  } catch (error) {
    console.error('Error fetching live price:', error);
    res.status(500).json({ message: 'Failed to fetch live price' });
  }
});

// Get market prices by product
router.get('/product/:product', async (req, res) => {
  try {
    const [prices] = await pool.query(
      'SELECT * FROM market_prices WHERE product LIKE ? ORDER BY updated_at DESC',
      [`%${req.params.product}%`]
    );
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get market prices by location
router.get('/location/:location', async (req, res) => {
  try {
    const [prices] = await pool.query(
      'SELECT * FROM market_prices WHERE location LIKE ? ORDER BY updated_at DESC',
      [`%${req.params.location}%`]
    );
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new market price (protected route)
router.post('/', auth, async (req, res) => {
  const { product, price, location, unit, supplyStatus, demandStatus, marketTrend, weatherImpact, priceHistory } = req.body;
  
  if (!product || !price || !location) {
    return res.status(400).json({ message: 'Product, price, and location are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO market_prices (product, price, location, unit, supplyStatus, demandStatus, marketTrend, weatherImpact, priceHistory, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [product, price, location, unit || 'kg', supplyStatus || 'medium', demandStatus || 'medium', marketTrend || 'stable', weatherImpact || 'neutral', JSON.stringify(priceHistory || [])]
    );

    // Fetch the newly inserted price
    const [rows] = await pool.query('SELECT * FROM market_prices WHERE id = ?', [result.insertId]);
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io && rows[0]) {
      io.emit('priceUpdate', rows[0]);
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding market price:', error);
    res.status(400).json({ message: 'Failed to add market price' });
  }
});

// Update market price (protected route)
router.patch('/:id', auth, async (req, res) => {
  const { price, location, unit, supplyStatus, demandStatus, marketTrend, weatherImpact, priceHistory } = req.body;
  
  if (!price) {
    return res.status(400).json({ message: 'Price is required' });
  }

  try {
    await pool.query(
      'UPDATE market_prices SET price=?, location=?, unit=?, supplyStatus=?, demandStatus=?, marketTrend=?, weatherImpact=?, priceHistory=?, updated_at=NOW() WHERE id=?',
      [price, location, unit, supplyStatus, demandStatus, marketTrend, weatherImpact, JSON.stringify(priceHistory || []), req.params.id]
    );

    // Fetch the updated price
    const [rows] = await pool.query('SELECT * FROM market_prices WHERE id = ?', [req.params.id]);
    
    if (rows && rows[0]) {
      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.emit('priceUpdate', rows[0]);
      }
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating market price:', error);
    res.status(400).json({ message: 'Failed to update market price' });
  }
});

// Delete market price (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM market_prices WHERE id=?', [req.params.id]);
    res.json({ message: 'Market price deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get market insights with real-time updates
router.get('/insights/:product', async (req, res) => {
  try {
    const [prices] = await pool.query(
      'SELECT * FROM market_prices WHERE product = ? ORDER BY updated_at DESC',
      [req.params.product]
    );

    if (prices.length === 0) {
      return res.status(404).json({ message: 'No data found for this product' });
    }

    // Calculate market insights
    const insights = {
      currentPrice: prices[0].price,
      priceChange: prices.length > 1 ? prices[0].price - prices[1].price : 0,
      averagePrice: prices.reduce((acc, curr) => acc + curr.price, 0) / prices.length,
      highestPrice: Math.max(...prices.map(p => p.price)),
      lowestPrice: Math.min(...prices.map(p => p.price)),
      supplyStatus: prices[0].supplyStatus,
      demandStatus: prices[0].demandStatus,
      marketTrend: prices[0].marketTrend,
      weatherImpact: prices[0].weatherImpact,
      priceHistory: prices[0].priceHistory ? JSON.parse(prices[0].priceHistory) : [],
      lastUpdated: prices[0].updated_at
    };

    // Emit real-time update for insights
    const io = req.app.get('io');
    if (io) {
      io.emit('insightsUpdate', { product: req.params.product, insights });
    }

    res.json(insights);
  } catch (error) {
    console.error('Error fetching market insights:', error);
    res.status(500).json({ message: 'Failed to fetch market insights' });
  }
});

module.exports = router; 