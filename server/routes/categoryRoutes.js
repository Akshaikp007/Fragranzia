const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const checkAuth = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/adminMiddleware");

router.route('/')
  .get(getCategories)
  .post(checkAuth, checkAdmin, addCategory);

router.route('/:id')
  .put(checkAuth, checkAdmin, updateCategory)
  .delete(checkAuth, checkAdmin, deleteCategory);

module.exports = router;
