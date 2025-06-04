const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded; // Attach decoded token to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware to check if user has required role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. You don't have permission to access this resource.",
        requiredRole: req.user.role
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  checkRole
};
