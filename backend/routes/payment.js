const express = require('express');
const router = express.Router();
const db = require('../db');

// Add Payment
router.post('/add', (req, res) => {
  const { user_id, amount, payment_method } = req.body;
  const sql = "INSERT INTO payment (user_id, amount, payment_method) VALUES (?, ?, ?)";
  db.query(sql, [user_id, amount, payment_method], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment added!", paymentId: result.insertId });
  });
});

// Get All Payments
router.get('/', (req, res) => {
  db.query("SELECT * FROM payment", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
