const Product = require("../models/Products");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Create or update product quantity
// @route   POST /api/products
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, image } = req.body;
    let quantity = req.body.quantity;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title required" });
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    // Default quantity to 1 if not provided
    if (quantity === undefined) {
      quantity = 1;
    }

    if (typeof quantity !== "number") {
      return res.status(400).json({ message: "Quantity must be a number" });
    }

    const existingProduct = await Product.findOne({ title });

    if (existingProduct) {
      const updatedQuantity = (existingProduct.quantity || 0) + quantity;

      // Check for negative result
      if (updatedQuantity < 0) {
        return res.status(400).json({
          message: "Invalid quantity update: result would be negative",
          currentQuantity: existingProduct.quantity,
        });
      }

      existingProduct.quantity = updatedQuantity;
      await existingProduct.save();
      return res.status(200).json({
        message: "Quantity updated",
        product: existingProduct,
      });
    }

    // For new product
    if (quantity < 0) {
      return res.status(400).json({
        message: "Invalid quantity: must be 0 or positive",
      });
    }

    const product = new Product({
      title,
      price,
      ...(category && { category }),
      ...(image && { image }),
      quantity,
    });

    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Public
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, category, image, quantity } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data sent" });
    }

    if (price && (typeof price !== "number" || price <= 0)) {
      return res.status(400).json({ message: "Invalid price" });
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

    if (!updatedProduct) return res.status(404).json({ message: "Not found" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Deleted", product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
