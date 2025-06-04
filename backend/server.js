const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { authenticateToken } = require("./middleware/authMiddleware");

// Load environment variables
dotenv.config();

const db = require("./db"); // 👈 import from db.js

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Global db
app.set("db", db);

// Check if we're using mock database
if (db.isMockDb()) {
  console.log("⚠️ Running with mock database - some features may be limited");
  console.log("📝 To use a real MySQL database:");
  console.log("   1. Set up MySQL and create a database named 'agritech'");
  console.log("   2. Update DB_* settings in .env file with your credentials");
  console.log("   3. Set DB_USE_MOCK=false in .env file");
}

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/product"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/delivery-partner", require("./routes/deliveryPartner"));
app.use("/api/bulk-orders", require("./routes/bulkOrder"));
app.use("/api/market-prices", require("./routes/marketPrices"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/demand-forecast", require("./routes/demandForecast"));
app.use("/api/user", require("./routes/user"));
app.use("/api/reviews", require("./routes/reviews"));

// Try to load AI routes, but don't crash if it fails
try {
  const aiRoutes = require("./routes/ai");
  app.use("/api/ai", aiRoutes);
  console.log("AI routes loaded successfully");
} catch (error) {
  console.warn("Failed to load AI routes:", error.message);
  // Create a mock AI endpoint
  app.use("/api/ai/ask", (req, res) => {
    res.json({
      answer: "AI service is currently unavailable. This is a fallback response.",
      mockResponse: true
    });
  });
}

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 API is running!");
});

// --- SOCKET.IO SETUP ---
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

// Set io on app after io is created
app.set('io', io);

// Store delivery partner locations in memory (for demo)
const partnerLocations = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Listen for location updates from delivery partner
  socket.on("partnerLocation", ({ partnerId, coords }) => {
    partnerLocations[partnerId] = coords;
    // Broadcast to all clients (or filter for customers with this order)
    io.emit("partnerLocationUpdate", { partnerId, coords });
  });

  // Listen for order status updates
  socket.on("orderStatus", ({ orderId, status }) => {
    io.emit("orderStatusUpdate", { orderId, status });
  });

  // Listen for new order notifications (admin/auto)
  socket.on("newOrder", (order) => {
    io.emit("newOrderNotification", order);
  });

  // --- Farmer Group Chat ---
  socket.on("groupMessage", (msg) => {
    // Broadcast to all except sender
    socket.broadcast.emit("groupMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const { checkRole } = require("./middleware/authMiddleware");

app.get("/api/admin/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
  try {
    // Use the db connection to get users
    db.query("SELECT id, name, email, role FROM users", (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error in admin users route:", error);
    res.status(500).json({ message: "Server error" });
  }
});
