const express = require('express');
const router = express.Router();
const db = require('../db');

// Add product
router.post('/add', (req, res) => {
  const { seller_id, name, price, location, image_url, stock } = req.body;
  db.query(
    'INSERT INTO products (seller_id, name, price, location, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
    [seller_id, name, price, location, image_url, stock],
    (err, result) => {
      if (err) {
        console.error('Error adding product:', err);
        return res.status(500).json({ error: err });
      }
      return res.json({ message: 'Product added' });
    }
  );
});

// Get all products with seller info
router.get('/', (req, res) => {
  const sql = `
    SELECT
      products.*,
      users.gpay AS sellerGpay,
      users.upi AS sellerUpi,
      users.phonepe AS sellerPhonepe,
      users.phone AS sellerPhone
    FROM products
    JOIN users ON products.seller_id = users.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: err });
    }
    return res.json(results);
  });
});

// Edit product by ID
router.put('/:id', (req, res) => {
  const { name, price, location, image_url, stock } = req.body;
  const { id } = req.params;

  console.log('Update product request:', req.body);

  if (
    !name?.toString().trim() ||
    !price?.toString().trim() ||
    !location?.toString().trim() ||
    !image_url?.toString().trim() ||
    !stock?.toString().trim()
  ) {
    return res.status(400).json({
      error: 'All fields (name, price, location, image_url, stock) are required and cannot be empty.'
    });
  }

  db.query(
    'UPDATE products SET name = ?, price = ?, location = ?, image_url = ?, stock = ? WHERE id = ?',
    [name, price, location, image_url, stock, id],
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      return res.json({ message: 'Product updated' });
    }
  );
});

// Delete product by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: err });
    }
    return res.json({ message: 'Product deleted' });
  });
});

module.exports = router;
