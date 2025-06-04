const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Only if you want token checking (optional)
require("dotenv").config();
const authenticateToken = require("../middleware/authenticateToken");

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Change Password Route
router.put("/change-password/:id", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide current and new password" });
  }

  // (Optional) Token check example
  // const token = req.headers.authorization?.split(" ")[1];
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (decoded.id != userId) {
  //   return res.status(403).json({ message: "Not authorized" });
  // }

  // Fetch user from DB
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    async (err, results) => {
      if (err) {
        console.error("❌ Error fetching user:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      // Compare current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in DB
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId],
        (err, result) => {
          if (err) {
            console.error("❌ Error updating password:", err);
            return res
              .status(500)
              .json({ message: "Server error while updating password" });
          }
          res.json({ message: "✅ Password changed successfully" });
        }
      );
    }
  );
});

// ✅ Edit Profile Route
router.put("/edit-profile/:id", (req, res) => {
  const { name, email } = req.body;
  const userId = req.params.id;

  if (!name || !email) {
    return res.status(400).json({ message: "Please provide name and email" });
  }

  // (Optional) Token check example
  // const token = req.headers.authorization?.split(" ")[1];
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (decoded.id != userId) {
  //   return res.status(403).json({ message: "Not authorized" });
  // }

  // Update the name and email
  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, userId],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating profile:", err);
        return res
          .status(500)
          .json({ message: "Server error while updating profile" });
      }

      // Fetch updated user data
      db.query(
        "SELECT id, name, email, role, avatar FROM users WHERE id = ?",
        [userId],
        (err, userResult) => {
          if (err) {
            console.error("❌ Error fetching updated user:", err);
            return res.status(500).json({ message: "Server error" });
          }

          res.json({
            message: "✅ Profile updated successfully",
            user: userResult[0],
          });
        }
      );
    }
  );
});

// ✅ Delete Account Route
router.delete("/delete-account/:id", authenticateToken, (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const userId = req.params.id;
  const db = require("../db");

  // First, delete related payments
  db.query("DELETE FROM payment WHERE user_id = ?", [userId], (err) => {
    if (err) {
      console.error("❌ Error deleting payments:", err);
      return res.status(500).json({ message: err.message });
    }
    // Then, delete the user
    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
      if (err) {
        console.error("❌ Error deleting account:", err);
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: "✅ Account deleted successfully" });
    });
  });
});

module.exports = router;
