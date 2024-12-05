const express = require("express");
const {
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Protect all cart routes
router.use(protect);

// Add a product to the cart
router.post("/", addToCart);

// Update quantity of a product in the cart
router.put("/", updateCartItem);

// Remove a product from the cart
router.delete("/:productId", removeCartItem);

module.exports = router;
