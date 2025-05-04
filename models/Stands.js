const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const standSchema = new Schema({
  standID: { type: String, required: true },
  standName: { type: String, required: true },
  isFull: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
});
const Stand = mongoose.model("stands", standSchema);
module.exports = Stand;
