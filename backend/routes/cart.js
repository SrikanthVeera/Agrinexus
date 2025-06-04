const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all cart items for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT cart.*, products.name, products.price, products.image_url, products.location, 'regular' as type
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ? AND (cart.type IS NULL OR cart.type = 'regular')
    UNION ALL
    SELECT cart.*, bulk_order_products.name, bulk_order_products.price, bulk_order_products.image as image_url, bulk_order_products.location, 'bulk_order' as type
    FROM cart
    JOIN bulk_order_products ON cart.product_id = bulk_order_products.id
    WHERE cart.user_id = ? AND cart.type = 'bulk_order'
    UNION ALL
    SELECT cart.*, entrepreneur_products.name, entrepreneur_products.price, entrepreneur_products.image as image_url, entrepreneur_products.location, 'entrepreneur' as type
    FROM cart
    JOIN entrepreneur_products ON cart.product_id = entrepreneur_products.id
    WHERE cart.user_id = ? AND cart.type = 'entrepreneur'
  `;
  db.query(sql, [userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add a product to cart
router.post('/add', (req, res) => {
  const { user_id, product_id, quantity, type } = req.body;
  db.query(
    'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND type = ?',
    [user_id, product_id, type || 'regular'],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) {
        // Update quantity
        db.query(
          'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND type = ?',
          [quantity, user_id, product_id, type || 'regular'],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ message: 'Cart updated' });
          }
        );
      } else {
        // Insert new
        db.query(
          'INSERT INTO cart (user_id, product_id, quantity, type) VALUES (?, ?, ?, ?)',
          [user_id, product_id, quantity, type || 'regular'],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ message: 'Added to cart' });
          }
        );
      }
    }
  );
});

// Update quantity
router.put('/update', (req, res) => {
  const { user_id, product_id, quantity, type } = req.body;
  db.query(
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ? AND type = ?',
    [quantity, user_id, product_id, type || 'regular'],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Quantity updated' });
    }
  );
});

// Remove item from cart
router.delete('/remove', (req, res) => {
  const { user_id, product_id, type } = req.body;
  db.query(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND type = ?',
    [user_id, product_id, type || 'regular'],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Removed from cart' });
    }
  );
});

module.exports = router; 