const express = require("express");
const checkAuth = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/adminMiddleware");
const {
  createOrder,
  getUserOrders,
  cancelOrder,
  returnOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getDashboardStats
} = require("../controllers/orderController");

const router = express.Router();

// User Protected Routes
router.post("/create", checkAuth, createOrder);
router.get("/", checkAuth, getUserOrders);
router.put("/cancel/:orderId", checkAuth, cancelOrder);
router.put("/return/:orderId", checkAuth, returnOrder);

// Admin Protected Routes
router.get("/admin", checkAuth, checkAdmin, getAllOrdersAdmin);
router.get("/admin/dashboard-stats", checkAuth, checkAdmin, getDashboardStats);
router.put("/admin/status/:orderId", checkAuth, checkAdmin, updateOrderStatusAdmin);

module.exports = router;
