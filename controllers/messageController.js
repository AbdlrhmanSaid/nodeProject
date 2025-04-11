const Message = require("../models/Messages");

// @desc    Create new message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
  try {
    const { user, action, info } = req.body;
    const message = new Message({ user, action, info });
    await message.save();
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Public
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete all messages
// @route   DELETE /api/messages
// @access  Public
exports.deleteAllMessages = async (req, res) => {
  try {
    await Message.deleteMany();
    res.json({ success: true, message: "تم مسح جميع الرسائل" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete single message
// @route   DELETE /api/messages/:id
// @access  Public
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: "تم مسح الرسالة بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete messages where user !== "stand"
// @route   DELETE /api/messages/not-stand
// @access  Public
exports.deleteNotStandMessages = async (req, res) => {
  try {
    await Message.deleteMany({ user: { $ne: "stand" } });
    res.json({
      success: true,
      message: "تم مسح جميع الرسائل التي يكون user !== 'stand'",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete messages where user === "stand"
// @route   DELETE /api/messages/only-stand
// @access  Public
exports.deleteStandMessages = async (req, res) => {
  try {
    await Message.deleteMany({ user: "stand" });
    res.json({
      success: true,
      message: "تم مسح جميع الرسائل التي يكون user === 'stand'",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
