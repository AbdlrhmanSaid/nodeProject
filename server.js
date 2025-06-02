const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/stands", require("./routes/standRoutes"));

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 3000;
module.exports = app;
