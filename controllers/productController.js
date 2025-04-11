const Product = require("../models/Products");
// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, image, quantity } = req.body;

    if (!title || !price || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + 1;
      await existingProduct.save();
      return res.status(200).json({
        message: "Product already exists. Quantity increased.",
        product: existingProduct,
      });
    }

    const newQuantity = quantity !== undefined ? quantity : 1;
    const product = new Product({
      title,
      price,
      category,
      image,
      quantity: newQuantity,
    });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, category, image, quantity } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "يجب إرسال بيانات للتحديث" });
    }

    if (price && (typeof price !== "number" || price <= 0)) {
      return res
        .status(400)
        .json({ message: "يجب أن يكون السعر رقمًا موجبًا" });
    }

    const updateData = { title, price, category, image };
    if (quantity !== undefined) {
      updateData.quantity = quantity;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "المنتج غير موجود" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
