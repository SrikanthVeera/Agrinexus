const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all leftovers
router.get('/', (req, res) => {
  db.query('SELECT * FROM leftovers ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new leftover
router.post('/', (req, res) => {
  const { name, quantity, price, location, image, seller_id } = req.body;
  if (!name || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.query(
    'INSERT INTO leftovers (name, quantity, price, location, image, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name, quantity, price, location, image, seller_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, quantity, price, location, image, seller_id });
    }
  );
});

// Update quantity after purchase
router.put('/:id', (req, res) => {
  const { quantity } = req.body;
  db.query('UPDATE leftovers SET quantity = ? WHERE id = ?', [quantity, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Quantity updated' });
  });
});

module.exports = router; 