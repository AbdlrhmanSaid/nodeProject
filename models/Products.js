const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [0, "Quantity cannot be negative"],
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;
