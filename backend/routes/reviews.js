const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a review
router.post('/', async (req, res) => {
  const { reviewer_id, reviewee_id, order_id, rating, comment } = req.body;
  try {
    const [result] = await db.promise().query(
      'INSERT INTO reviews (reviewer_id, reviewee_id, order_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [reviewer_id, reviewee_id, order_id, rating, comment]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get reviews for a user
router.get('/:userId', async (req, res) => {
  try {
    const [reviews] = await db.promise().query(
      'SELECT * FROM reviews WHERE reviewee_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 