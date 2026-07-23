const express = require("express");
const checkAuth = require("../middlewares/authMiddleware");
const { getAddresses, addAddress, deleteAddress, setPrimaryAddress } = require("../controllers/addressController");

const router = express.Router();

// Apply auth middleware to all address routes
router.use(checkAuth);

router.get("/", getAddresses);
router.post("/", addAddress);
router.delete("/:id", deleteAddress);
router.put("/:id/primary", setPrimaryAddress);

module.exports = router;
