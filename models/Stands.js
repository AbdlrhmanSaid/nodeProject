const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const standSchema = new Schema({
  standName: { type: String, required: true },
  isFull: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  maxCapacity: { type: Number, default: 10 },
  productSpacing: { type: Number, default: 0 },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  currentProductCount: { type: Number, default: 0 },
});

const Stand = mongoose.model("stands", standSchema);
module.exports = Stand;
