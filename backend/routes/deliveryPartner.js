const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all delivery partners
router.get('/', (req, res) => {
  db.query('SELECT * FROM delivery_partners', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get delivery partner by id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM delivery_partners WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});

// Create delivery partner
router.post('/', (req, res) => {
  const { name, phone, vehicle, rating, deliveries, image, available, bike_number, address, license, district, pincode, experience } = req.body;
  db.query(
    'INSERT INTO delivery_partners (name, phone, vehicle, rating, deliveries, image, available, bike_number, address, license, district, pincode, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone, vehicle, rating, deliveries, image, available, bike_number, address, license, district, pincode, experience],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

// Update delivery partner
router.put('/:id', (req, res) => {
  const { name, phone, vehicle, rating, deliveries, image, available, bike_number, address, license, district, pincode, experience } = req.body;
  db.query(
    'UPDATE delivery_partners SET name=?, phone=?, vehicle=?, rating=?, deliveries=?, image=?, available=?, bike_number=?, address=?, license=?, district=?, pincode=?, experience=? WHERE id=?',
    [name, phone, vehicle, rating, deliveries, image, available, bike_number, address, license, district, pincode, experience, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated' });
    }
  );
});

// Delete delivery partner
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM delivery_partners WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted' });
  });
});

// Toggle availability
router.put('/:id/availability', (req, res) => {
  const { available } = req.body;
  db.query('UPDATE delivery_partners SET available=? WHERE id=?', [available, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Availability updated' });
  });
});

module.exports = router; 