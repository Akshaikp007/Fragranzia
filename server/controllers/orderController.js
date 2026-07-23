const { Order } = require("../models/OrderModel");
const User = require("../models/User");
const { Address } = require("../models/Address");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Create new orders from cart items (one order per cart item)
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required" });
    }

    // Verify address exists and belongs to the user
    const address = await Address.findOne({ _id: shippingAddress, user: req.userId, isActive: true });
    if (!address) {
      return res.status(400).json({ message: "Invalid or inactive shipping address" });
    }

    // Fetch user and populated cart
    const user = await User.findById(req.userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Verify all products in cart have sufficient stock first
    for (const item of user.cart) {
      if (!item.product) continue;
      const product = item.product;
      if (product.quantity === undefined || product.quantity <= 0) {
        return res.status(400).json({ message: `Product "${product.name}" is out of stock` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${product.name}". Available: ${product.quantity}` });
      }
    }

    const createdOrders = [];
    const paymentStatus = paymentMethod === "cod" ? "Pending" : "Paid";
    const paidAt = paymentStatus === "Paid" ? new Date() : null;

    // Create a separate order for each item in the cart
    for (const item of user.cart) {
      if (!item.product) continue;

      const product = item.product;
      const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      const totalPrice = price * item.quantity;

      const newOrder = new Order({
        user: req.userId,
        orderItems: {
          product: product._id,
          quantity: item.quantity,
        },
        shippingAddress,
        paymentMethod,
        paymentStatus,
        paidAt,
        totalPrice,
        balanceTotal: totalPrice,
        deliveryStatus: "Pending"
      });

      await newOrder.save();
      createdOrders.push(newOrder);

      // Optionally decrement product stock quantity if stock management exists
      if (product.quantity !== undefined) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
        await product.save();
      }
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to place order due to server error" });
  }
};

// Get order history for the logged-in user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("orderItems.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// Cancel a pending or processing order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryStatus !== "Pending" && order.deliveryStatus !== "Processing") {
      return res.status(400).json({ message: `Cannot cancel order with delivery status: ${order.deliveryStatus}` });
    }

    order.deliveryStatus = "Cancelled";

    // Restock the product quantity if not already adjusted
    if (!order.stockAdjusted) {
      if (order.orderItems && order.orderItems.product) {
        const product = await Product.findById(order.orderItems.product);
        if (product) {
          product.quantity = (product.quantity || 0) + order.orderItems.quantity;
          await product.save();
        }
      }
      order.stockAdjusted = true;
    }

    await order.save();

    // Re-populate and send back
    const updatedOrder = await Order.findById(orderId)
      .populate("orderItems.product")
      .populate("shippingAddress");

    res.status(200).json({ message: "Order cancelled successfully", order: updatedOrder });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error while cancelling order" });
  }
};

// Return a delivered order
const returnOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { returnReason } = req.body;

    if (!returnReason) {
      return res.status(400).json({ message: "Return reason is required" });
    }

    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryStatus !== "Delivered") {
      return res.status(400).json({ message: "Only delivered orders can be returned" });
    }

    order.isReturned = true;
    order.returnReason = returnReason;
    order.returnStatus = "Requested";
    order.deliveryStatus = "Returned"; // Align status transition
    order.returnedAt = new Date();

    // Restock if not damaged product or defective product, and not already adjusted
    if (!order.stockAdjusted) {
      const isDamaged = returnReason === "Damaged Product" || returnReason === "Defective Product";
      if (!isDamaged) {
        if (order.orderItems && order.orderItems.product) {
          const product = await Product.findById(order.orderItems.product);
          if (product) {
            product.quantity = (product.quantity || 0) + order.orderItems.quantity;
            await product.save();
          }
        }
      }
      order.stockAdjusted = true;
    }

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("orderItems.product")
      .populate("shippingAddress");

    res.status(200).json({ message: "Return request submitted successfully", order: updatedOrder });
  } catch (error) {
    console.error("Return order error:", error);
    res.status(500).json({ message: "Server error while requesting return" });
  }
};

// Get all orders in the store (Admin Only)
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("orderItems.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get all orders admin error:", error);
    res.status(500).json({ message: "Server error while fetching all orders" });
  }
};

// Update order status (Admin Only)
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (deliveryStatus !== undefined) {
      order.deliveryStatus = deliveryStatus;
      if (deliveryStatus === "Delivered") {
        order.deliveredAt = new Date();
      } else if (deliveryStatus === "Returned") {
        order.returnedAt = new Date();
        order.isReturned = true;
        if (!order.returnStatus) {
          order.returnStatus = "Completed";
        }

        // Restock on return (excluding damaged/defective product)
        if (!order.stockAdjusted) {
          const isDamaged = order.returnReason === "Damaged Product" || order.returnReason === "Defective Product";
          if (!isDamaged) {
            if (order.orderItems && order.orderItems.product) {
              const product = await Product.findById(order.orderItems.product);
              if (product) {
                product.quantity = (product.quantity || 0) + order.orderItems.quantity;
                await product.save();
              }
            }
          }
          order.stockAdjusted = true;
        }
      } else if (deliveryStatus === "Cancelled") {
        // Restock on cancel
        if (!order.stockAdjusted) {
          if (order.orderItems && order.orderItems.product) {
            const product = await Product.findById(order.orderItems.product);
            if (product) {
              product.quantity = (product.quantity || 0) + order.orderItems.quantity;
              await product.save();
            }
          }
          order.stockAdjusted = true;
        }
      }
    }

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "Paid") {
        order.paidAt = new Date();
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("user", "name email role")
      .populate("orderItems.product")
      .populate("shippingAddress");

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Update order status admin error:", error);
    res.status(500).json({ message: "Server error while updating order status" });
  }
};

// Get dashboard statistics (Admin Only)
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total sales (sum of totalPrice from orders that are not Cancelled)
    const salesData = await Order.aggregate([
      { $match: { deliveryStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // 2. Total orders
    const totalOrders = await Order.countDocuments();
    
    // 3. Products count
    const totalProducts = await Product.countDocuments();

    // 4. Customers count
    const totalCustomers = await User.countDocuments({ role: "user" });

    // 5. Weekly orders overview
    const startOf7DaysAgo = new Date();
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
    startOf7DaysAgo.setHours(0, 0, 0, 0);

    const ordersLast7Days = await Order.find({
      createdAt: { $gte: startOf7DaysAgo }
    });

    const orderCounts = {};
    ordersLast7Days.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('sv-SE'); // YYYY-MM-DD
      orderCounts[dateStr] = (orderCounts[dateStr] || 0) + 1;
    });

    const weeklyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('sv-SE');
      weeklyOrders.push({
        date: dateStr,
        count: orderCounts[dateStr] || 0
      });
    }

    // 6. Sales by category
    const categorySales = await Order.aggregate([
      { $match: { deliveryStatus: { $ne: "Cancelled" } } },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$categoryDetails.name", "Uncategorized"] },
          sales: { $sum: "$totalPrice" }
        }
      }
    ]);

    // Format all categories from DB with sales value
    const allCategories = await Category.find();
    const categorySalesMap = {};
    allCategories.forEach(cat => {
      categorySalesMap[cat.name] = 0;
    });

    categorySales.forEach(item => {
      const name = item._id || "Uncategorized";
      categorySalesMap[name] = (categorySalesMap[name] || 0) + item.sales;
    });

    const formattedCategorySales = Object.entries(categorySalesMap).map(([name, sales]) => ({
      name,
      value: sales
    }));

    if (formattedCategorySales.length === 0) {
      formattedCategorySales.push(
        { name: "Home & Kitchen", value: 0 },
        { name: "Fashion", value: 0 },
        { name: "Electronics", value: 0 }
      );
    }

    res.status(200).json({
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers,
      weeklyOrders,
      categorySales: formattedCategorySales
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  returnOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getDashboardStats
};
