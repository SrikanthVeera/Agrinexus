const express = require("express");
const router = express.Router();
const db = require("../db"); // you can create a db.js that exports connection if needed
const authenticateToken = require("../middleware/authenticateToken");

// Place Order (Buyer)
router.post("/place", (req, res) => {
  const { buyerId, items, address, paymentMethod, totalPrice } = req.body;

  const sql =
    "INSERT INTO orders (buyer_id, items, address, payment_method, total_price) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      buyerId,
      JSON.stringify(items),
      JSON.stringify(address),
      paymentMethod,
      totalPrice,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Order placing error:", err);
        return res.status(500).json({ message: "Order placing failed" });
      }
      res
        .status(201)
        .json({
          message: "Order placed successfully",
          orderId: result.insertId,
        });
    }
  );
});

// Driver sees available orders (Pending Orders)
router.get("/available-orders", (req, res) => {
  const sql = "SELECT * FROM orders WHERE status = 'Pending'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Fetching available orders error:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }
    res.status(200).json(results);
  });
});

// Driver accepts an order
router.post("/accept", (req, res) => {
  const { driverId, orderId } = req.body;

  const sql =
    "UPDATE orders SET assigned_driver_id = ?, status = 'Confirmed' WHERE id = ?";
  db.query(sql, [driverId, orderId], (err, result) => {
    if (err) {
      console.error("❌ Accepting order error:", err);
      return res.status(500).json({ message: "Failed to accept order" });
    }
    res.status(200).json({ message: "Order accepted by driver" });
  });
});

// Buyer sees which driver is assigned
router.get("/driver-details/:orderId", (req, res) => {
  const { orderId } = req.params;

  const sql = `
    SELECT drivers.name, drivers.phone
    FROM orders
    JOIN drivers ON orders.assigned_driver_id = drivers.id
    WHERE orders.id = ?
  `;
  db.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error("❌ Fetching driver details error:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch driver details" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No driver assigned yet" });
    }
    res.status(200).json(results[0]);
  });
});

// Get all orders for a user (MySQL)
router.get('/my-orders/:userId', authenticateToken, (req, res) => {
  // Only allow if the user is requesting their own orders
  if (parseInt(req.params.userId) !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const userId = req.params.userId;
  const sql = "SELECT * FROM orders WHERE buyer_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Fetching user orders error:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }
    res.status(200).json(results);
  });
});

// Get all products ordered from a specific seller
router.get('/seller-products/:sellerId', (req, res) => {
  const sellerId = parseInt(req.params.sellerId);
  if (!sellerId) {
    return res.status(400).json({ message: 'Invalid sellerId' });
  }
  // Get all orders
  db.query('SELECT * FROM orders', (err, orders) => {
    if (err) {
      console.error('❌ Fetching all orders error:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    // Get all products for this seller
    db.query('SELECT * FROM products WHERE seller_id = ?', [sellerId], (err, products) => {
      if (err) {
        console.error('❌ Fetching seller products error:', err);
        return res.status(500).json({ message: 'Error fetching products' });
      }
      const sellerProductIds = products.map(p => p.id);
      console.log('Seller Product IDs:', sellerProductIds);
      let result = [];
      orders.forEach(order => {
        let items = [];
        try {
          items = JSON.parse(order.items);
        } catch (e) {}
        items.forEach(item => {
          const pid = item.productId || item.product_id || item.id;
          if (sellerProductIds.includes(pid)) {
            result.push({
              ...item,
              orderId: order.id,
              buyerId: order.buyer_id,
              orderStatus: order.status,
              orderDate: order.created_at
            });
          }
        });
      });
      console.log('Result:', result);
      res.json(result);
    });
  });
});

// Update order status
router.put('/:orderId/status', authenticateToken, (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error('❌ Order status update error:', err);
      return res.status(500).json({ message: 'Failed to update order status' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully' });
  });
});

module.exports = router;
