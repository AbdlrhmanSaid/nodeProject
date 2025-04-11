const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const db_user = process.env.DB_USER;
    const db_password = encodeURIComponent(process.env.DB_PASSWORD);
    const db_name = process.env.DB_NAME;

    const conn = await mongoose.connect(
      `mongodb+srv://${db_user}:${db_password}@cluster0.9fimd.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
