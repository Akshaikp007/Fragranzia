const User = require("../models/User");

// Get wishlist for the logged-in user
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add product to the wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product is already in the wishlist
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    // Populate and return updated wishlist
    const populatedUser = await User.findById(req.userId).populate("wishlist");
    res.status(200).json({ message: "Product added to wishlist", wishlist: populatedUser.wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove product from the wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove item from wishlist array
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    // Populate and return updated wishlist
    const populatedUser = await User.findById(req.userId).populate("wishlist");
    res.status(200).json({ message: "Product removed from wishlist", wishlist: populatedUser.wishlist });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
