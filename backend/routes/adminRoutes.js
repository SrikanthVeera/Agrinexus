const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection
const authenticateToken = require("../middleware/authenticateToken");


// Get all users (admin only)
router.get("/users", authenticateToken, async (req, res) => {
  // Special case for our hardcoded admin
  const isHardcodedAdmin = req.user && 
    (req.user.email === "srikanthveera0912@gmail.com" || req.user.role === "admin");
  
  if (!isHardcodedAdmin && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ users: results });
  });
});

// Delete a user
router.delete("/users/:id", authenticateToken, (req, res) => {
  // Special case for our hardcoded admin
  const isHardcodedAdmin = req.user && 
    (req.user.email === "srikanthveera0912@gmail.com" || req.user.role === "admin");
  
  if (!isHardcodedAdmin && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete" });
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;
