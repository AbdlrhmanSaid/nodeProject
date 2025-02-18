const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/Users");

const app = express();
app.use(express.json());

const db_password = encodeURIComponent("#12Bode34#");

const port = process.env.PORT || 3000;

mongoose
  .connect(
    `mongodb+srv://Abdelrhman:${db_password}@cluster0.9fimd.mongodb.net/university?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Connection successful");
    app.listen(port, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((e) => {
    console.log("Error connecting to cluster:", e.message);
  });

app.get("/", async (req, res) => {
  res.send("welcome");
});

// get all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // إخفاء كلمة المرور
    res.json(users);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// get one user
app.get("/getUsers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // إخفاء كلمة المرور
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// post user
app.post("/postUser", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // التحقق من عدم إدخال بيانات فارغة
    if (!username || !password || !email) {
      return res.status(400).send("All fields are required");
    }

    // التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    const user = new User({ username, password, email });
    await user.save();
    res.status(201).send("User added successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// update user
app.patch("/updateUser/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).send("User not found");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.json({ message: "User deleted successfully", user });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
