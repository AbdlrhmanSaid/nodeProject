const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// استيراد الموديلات
const User = require("./model/Users");
const Product = require("./model/Products");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);

// بيانات الاتصال بقاعدة البيانات
const db_user = "Abdelrhman";
const db_password = encodeURIComponent("#12Bode34#");
const db_name = "university";
const port = process.env.PORT || 3000;

// اتصال بقاعدة البيانات
mongoose
  .connect(
    `mongodb+srv://${db_user}:${db_password}@cluster0.9fimd.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((e) => console.log("❌ Database connection error:", e.message));

// ✅ نقطة الوصول الرئيسية
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// ==================== 👤 إدارة المستخدمين ====================
// 📌 استرجاع جميع المستخدمين بدون كلمات المرور
app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📌 استرجاع مستخدم واحد عبر ID
app.get("/getUsers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📌 إضافة مستخدم جديد
app.post("/postUser", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📌 تحديث بيانات المستخدم
app.patch("/updateUser/:id", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "يجب إرسال بيانات للتحديث" });
    }

    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({ message: "البريد الإلكتروني مستخدم بالفعل" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, username, password },
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "المستخدم غير موجود" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 حذف مستخدم
app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// ==================== 🛒 إدارة المنتجات ====================
// 📌 استرجاع جميع المنتجات
app.get("/getProducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📌 استرجاع منتج واحد عبر ID
app.get("/getProducts/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📌 إضافة منتج جديد
app.post("/postProduct", async (req, res) => {
  try {
    const { title, price, category, image } = req.body;

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
      return res.status(400).json({ message: "Title is already registered" });
    }

    const product = new Product({ title, price, category, image });
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📌 تحديث منتج
app.patch("/updateProduct/:id", async (req, res) => {
  try {
    const { title, price, category, image } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "يجب إرسال بيانات للتحديث" });
    }

    if (price && (typeof price !== "number" || price <= 0)) {
      return res
        .status(400)
        .json({ message: "يجب أن يكون السعر رقمًا موجبًا" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price, category, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "المنتج غير موجود" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 حذف منتج
app.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});
