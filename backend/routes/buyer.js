const express = require("express");
const router = express.Router();

// TEMPORARY TEST HANDLER
router.post("/place-order", (req, res) => {
  console.log("Request received at /place-order");
  res.status(200).json({ success: true, message: "Order received!" });
});



// export the router
module.exports = router;
