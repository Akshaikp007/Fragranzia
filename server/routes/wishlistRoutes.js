const express = require("express");
const checkAuth = require("../middlewares/authMiddleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

const router = express.Router();

// Apply auth middleware to all wishlist routes
router.use(checkAuth);

// GET user's wishlist
router.get("/", getWishlist);

// POST add item to wishlist (expects { productId } in body)
router.post("/add", addToWishlist);

// DELETE remove item from wishlist
router.delete("/remove/:productId", removeFromWishlist);

module.exports = router;
