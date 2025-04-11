const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  info: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Messages", messageSchema);
module.exports = Message;
