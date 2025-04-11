const User = require("../models/Users");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, position } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = new User({ username, password, email, position });
    await user.save();

    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Public
exports.updateUser = async (req, res) => {
  try {
    const { email, username, password, oldPassword, position } = req.body;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "يجب إرسال بيانات للتحديث" });
    }

    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    if (password) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "يجب تقديم كلمة المرور القديمة" });
      }
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "كلمة المرور القديمة غير صحيحة" });
      }
      user.password = password;
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (position !== undefined) user.position = position;

    await user.save();
    res.json({ message: "تم تحديث المستخدم بنجاح", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// @desc    Get user by email (for authentication)
// @route   POST /api/users/getByEmail
// @access  Public
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
