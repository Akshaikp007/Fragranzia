const express = require('express');
const router = express.Router();

const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const upload = require("../middlewares/upload");
const checkAuth = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/adminMiddleware");

// GET all products
router.get('/', getProducts);

// GET single product by ID
router.get('/:id', getProductById);

// ADD product with image upload (Admin Only)
router.post('/', checkAuth, checkAdmin, upload.single("image"), addProduct);

// UPDATE product with image upload (Admin Only)
router.put('/:id', checkAuth, checkAdmin, upload.single("image"), updateProduct);

// DELETE product (Admin Only)
router.delete('/:id', checkAuth, checkAdmin, deleteProduct);

module.exports = router;