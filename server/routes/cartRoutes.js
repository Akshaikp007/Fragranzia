const express = require("express");
const checkAuth = require("../middlewares/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

const router = express.Router();

// Apply auth middleware to all cart routes
router.use(checkAuth);

// GET user's cart
router.get("/", getCart);

// POST add item to cart (expects { productId, quantity } in body)
router.post("/add", addToCart);

// PUT update quantity of cart item (expects { productId, quantity } in body)
router.put("/update", updateCartQuantity);

// DELETE remove item from cart
router.delete("/remove/:productId", removeFromCart);

// DELETE clear all items from cart
router.delete("/clear", clearCart);

module.exports = router;
