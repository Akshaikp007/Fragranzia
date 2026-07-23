const Product = require('../models/Product');

// Create Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      salePrice,
      quantity,
      category,
      tags,
      offer,
      description,
      hasVariants,
    } = req.body;

    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: 'Name, price, and quantity are required'
      });
    }

    const imagePath = req.file ? (req.file.path.startsWith('http') ? req.file.path : req.file.filename) : null;

    const product = new Product({
      name,
      price,
      salePrice,
      quantity,
      category,
      tags,
      offer,
      description,
      hasVariants,

      images: imagePath ? [imagePath] : []
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {

    console.error(`Error in addProduct: ${error.message}`);

    res.status(500).json({
      message: 'Server error while adding product'
    });
  }
};

// Get Products WITH Populate, Search & Filter
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'popularity') sortOptions = { quantity: -1 };

    if (page !== null && limit !== null) {
      const skip = (page - 1) * limit;
      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate("category")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
      });
    }

    const products = await Product.find(query)
      .populate("category")
      .sort(sortOptions);

    res.status(200).json(products);

  } catch (error) {

    console.error(`Error in getProducts: ${error.message}`);

    res.status(500).json({
      message: 'Server error while fetching products'
    });
  }
};

// Get Single Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category");

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json(product);

  } catch (error) {
    console.error(`Error in getProductById: ${error.message}`);
    res.status(500).json({
      message: 'Server error while fetching product'
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      salePrice,
      quantity,
      category,
      tags,
      offer,
      description,
      hasVariants,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (salePrice !== undefined) product.salePrice = Number(salePrice);
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (offer !== undefined) product.offer = offer;
    if (hasVariants !== undefined) {
      product.hasVariants = hasVariants === 'true' || hasVariants === true;
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        product.tags = tags;
      } else {
        product.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }

    if (req.file) {
      const imagePath = req.file.path.startsWith('http') ? req.file.path : req.file.filename;
      product.images = [imagePath];
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error(`Error in updateProduct: ${error.message}`);
    res.status(500).json({
      message: 'Server error while updating product'
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(`Error in deleteProduct: ${error.message}`);
    res.status(500).json({
      message: 'Server error while deleting product'
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};