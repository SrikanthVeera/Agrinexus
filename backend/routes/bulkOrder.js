const express = require('express');
const router = express.Router();
const db = require('../db'); // Your MySQL connection

// Get all bulk order products
router.get('/', (req, res) => {
  db.query('SELECT * FROM bulk_order_products ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching bulk orders:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add a new bulk order product
router.post('/', (req, res) => {
  const { name, phone, location, image, kg, price } = req.body;
  
  // Validate required fields
  if (!name || !phone || !location || !kg || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Convert kg and price to numbers
  const kgNum = parseInt(kg);
  const priceNum = parseInt(price);

  if (isNaN(kgNum) || isNaN(priceNum)) {
    return res.status(400).json({ error: 'Invalid kg or price value' });
  }

  const sql = 'INSERT INTO bulk_order_products (name, phone, location, image, kg, price) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, phone, location, image || null, kgNum, priceNum];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding bulk order:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Return the newly created product with its ID
    const newProduct = {
      id: result.insertId,
      name,
      phone,
      location,
      image: image || null,
      kg: kgNum,
      price: priceNum
    };
    
    res.status(201).json(newProduct);
  });
});

// Delete a bulk order product
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  db.query('DELETE FROM bulk_order_products WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting bulk order:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  });
});

module.exports = router; 