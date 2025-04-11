const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // قراءة المتغيرات من ملف .env
    const db_user = process.env.DB_USER;
    const db_password = encodeURIComponent(process.env.DB_PASSWORD); // ترميز كلمة المرور بشكل صحيح
    const db_name = process.env.DB_NAME;

    // إعداد رابط الاتصال بـ MongoDB
    const conn = await mongoose.connect(
      `mongodb+srv://${db_user}:${db_password}@cluster0.9fimd.mongodb.net/${db_name}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true } // إضافة خيارات الاتصال الحديثة
    );

    // إذا تم الاتصال بنجاح
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    // في حال حدوث خطأ أثناء الاتصال
    console.error(`❌ Database connection error: ${err.message}`);
    process.exit(1); // إنهاء التطبيق إذا فشل الاتصال
  }
};

module.exports = connectDB;
