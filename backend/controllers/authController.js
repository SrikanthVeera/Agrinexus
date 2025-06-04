const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, phone, password, role, email } = req.body;

  try {
    const existing = await User.findOne({ where: { phone } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", role: newUser.role });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user is trying to login with the correct role
    if (role && user.role !== role) {
      return res.status(403).json({ 
        message: "Access denied. Please use the appropriate login page for your account type.",
        requiredRole: user.role
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      role: user.role,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
