const express = require("express");
const checkAuth = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/adminMiddleware");
const { 
  register, 
  home, 
  login, 
  getMe, 
  updateMe, 
  getAllCustomers, 
  toggleCustomerStatus,
  googleAuth
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/home", checkAuth, home);
router.get("/me", checkAuth, getMe);
router.put("/me", checkAuth, updateMe);

// Admin customer management routes
router.get("/admin/customers", checkAuth, checkAdmin, getAllCustomers);
router.put("/admin/customers/:id/status", checkAuth, checkAdmin, toggleCustomerStatus);

module.exports = router;

