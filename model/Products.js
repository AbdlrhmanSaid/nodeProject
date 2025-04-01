const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String , required: false},
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;
