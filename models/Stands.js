const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const standSchema = new Schema({
  standID: { type: String, required: true, unique: true },
  standName: { type: String, required: true },
  isFull: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  maxCapacity: { type: Number, default: 10 },
  productSpacing: { type: Number, default: 0 },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
});

const Stand = mongoose.model("stands", standSchema);
module.exports = Stand;
