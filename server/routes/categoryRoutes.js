const express = require('express');
const router = express.Router();
const { getCategories, addCategory } = require('../controllers/categoryController');
const checkAuth = require("../middlewares/authMiddleware");
const checkAdmin = require("../middlewares/adminMiddleware");

router.route('/')
  .get(getCategories)
  .post(checkAuth, checkAdmin, addCategory);

module.exports = router;
