const User = require("../models/User");
const Product = require("../models/Product");

// Get Cart items for logged-in user
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add product to Cart or increment its quantity if it already exists
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product is already in the cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    const totalQtyRequested = existingItem ? existingItem.quantity + qty : qty;
    if (product.quantity < totalQtyRequested) {
      return res.status(400).json({ message: `Cannot add more items than available stock. Available: ${product.quantity}` });
    }

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();
    
    // Fetch populated cart to return to the client
    const populatedUser = await User.findById(req.userId).populate("cart.product");
    res.status(200).json({ message: "Product added to cart", cart: populatedUser.cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update quantity of a product in the Cart
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (!productId || isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Valid Product ID and quantity >= 1 are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < qty) {
      return res.status(400).json({ message: `Cannot set quantity more than available stock. Available: ${product.quantity}` });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product in the cart
    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Set the new quantity
    item.quantity = qty;
    await user.save();

    const populatedUser = await User.findById(req.userId).populate("cart.product");
    res.status(200).json({ message: "Cart updated successfully", cart: populatedUser.cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a single product from the Cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the selected product
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const populatedUser = await User.findById(req.userId).populate("cart.product");
    res.status(200).json({ message: "Product removed from cart", cart: populatedUser.cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear the entire Cart
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully", cart: [] });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
};
