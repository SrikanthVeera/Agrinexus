const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // 👈 import db
const { sendRegistrationEmail } = require("../utils/emailService");
const nodemailer = require("nodemailer");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    console.log("Received registration data:", req.body);

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists with email or phone
    db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Server error" });
        }

        if (results.length > 0) {
          // Check if the existing user has the same email or phone
          const existingUser = results[0];
          if (existingUser.email === email) {
            return res.status(400).json({ message: "Email already registered" });
          } else if (existingUser.phone === phone) {
            return res.status(400).json({ message: "Phone number already registered" });
          }
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const sql =
          "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [name, email, phone, hashedPassword, role], async (err, result) => {
          if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ message: "Server error" });
          }

          try {
            // Send welcome email
            const emailInfo = await sendRegistrationEmail(email, name);
            
            // Only try to get preview URL if we have a valid email info
            let previewUrl = '';
            if (emailInfo && emailInfo.messageId && process.env.NODE_ENV !== 'production') {
              try {
                previewUrl = nodemailer.getTestMessageUrl(emailInfo);
                console.log('Email preview URL:', previewUrl);
              } catch (previewError) {
                console.error("Error getting email preview URL:", previewError);
              }
            }
            
            // Log registration success
            console.log(`User registered successfully: ${email} (${role})`);
            
            res.status(201).json({ 
              message: "User registered successfully",
              emailSent: true,
              emailPreview: previewUrl,
              role: role
            });
          } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
            // Still return success even if email fails
            res.status(201).json({ 
              message: "User registered successfully",
              emailSent: false,
              error: "Welcome email could not be sent",
              role: role
            });
          }
        });
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login Route
router.post("/login", (req, res) => {
  const { email, phone, password, role } = req.body;
  
  // User can login with either email or phone
  const loginIdentifier = email || phone;
  const identifierType = email ? "email" : "phone";
  
  console.log("Login attempt:", { [identifierType]: loginIdentifier, role });

  if (!loginIdentifier || !password) {
    return res.status(400).json({ message: "Email/Phone and password are required" });
  }

  // Regular database login - check both email and phone
  const query = email 
    ? "SELECT * FROM users WHERE email = ?" 
    : "SELECT * FROM users WHERE phone = ?";
  
  db.query(
    query,
    [loginIdentifier],
    async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if the user is trying to login with the correct role
        // Only enforce role check if a role was explicitly provided and not null
        if (role && role !== "undefined" && role !== "null" && user.role !== role) {
          console.log(`Role mismatch: User is ${user.role}, trying to login as ${role}`);
          return res.status(403).json({ 
            message: "Access denied. Please use the appropriate login page for your account type.",
            requiredRole: user.role
          });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET || "your_jwt_secret",
          { expiresIn: "7d" } // Extended token expiration to 7 days
        );

        console.log("Login successful for:", email || phone);
        
        res.json({
          token,
          user: { 
            _id: user.id, 
            name: user.name, 
            email: user.email,
            phone: user.phone,
            role: user.role 
          },
          role: user.role
        });
      } catch (error) {
        console.error("Password comparison error:", error);
        return res.status(500).json({ message: "Login error", error: error.message });
      }
    }
  );
});

// Verify token endpoint
router.get("/verify-token", authenticateToken, (req, res) => {
  try {
    // If middleware passes, token is valid
    // Get full user details from database
    db.query(
      "SELECT id, name, email, phone, role FROM users WHERE id = ?",
      [req.user.id],
      (err, results) => {
        if (err) {
          console.error("Error fetching user data:", err);
          return res.status(500).json({ valid: false, message: "Error fetching user data" });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ valid: false, message: "User not found" });
        }
        
        const userData = results[0];
        
        res.json({ 
          valid: true, 
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role
          }
        });
      }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ valid: false, message: "Server error" });
  }
});

// Get user profile by id
router.get("/profile/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // Check if user is requesting their own profile
  if (req.user.id != id) {
    return res.status(403).json({ error: "Unauthorized access to another user's profile" });
  }
  
  db.query(
    "SELECT id, name, email, phone, location, upi, gpay, phonepe FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ error: "User not found" });
      res.json(results[0]);
    }
  );
});

// Update user profile by id
router.put("/profile/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // Check if user is updating their own profile
  if (req.user.id != id) {
    return res.status(403).json({ error: "Unauthorized access to update another user's profile" });
  }
  
  const { phone, location, upi, gpay, phonepe } = req.body;
  db.query(
    "UPDATE users SET phone = ?, location = ?, upi = ?, gpay = ?, phonepe = ? WHERE id = ?",
    [phone, location, upi, gpay, phonepe, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Profile updated" });
    }
  );
});

module.exports = router;