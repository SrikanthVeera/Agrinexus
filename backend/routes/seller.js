const express = require("express");
const router = express.Router();

// Add product route
router.post("/add-product", (req, res) => {
  console.log("Add product request received!");
  console.log(req.body);
  res.status(200).json({ success: true, message: "Product added successfully!" });
});
module.exports = router;
