/**
 * @file server.js
 * @description จุดเริ่มต้นหลักของเซิร์ฟเวอร์ Express สำหรับ Back-end API
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 * ตามข้อกำหนดข้อ 4.d: ใช้ Express Framework ของ NodeJS สำหรับพัฒนาระบบ
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getDbStatus } = require('./config/db');

// โหลด Environment variables จากไฟล์ .env
dotenv.config({ path: path.join(__dirname, '../.env') });

// สร้างอินสแตนซ์ของ Express Application
const app = express();

// เชื่อมต่อฐานข้อมูล MongoDB Atlas หรือ Compass (ข้อกำหนด 4.e)
connectDB();

// ==========================================
// Middleware พื้นฐาน
// ==========================================
// อนุญาตให้ Front-end สามารถเรียกใช้งาน API ได้ (Cross-Origin Resource Sharing)
app.use(cors());

// แปลง Request Body ที่อยู่ในรูปแบบ JSON ให้กลายเป็น Javascript Object (ข้อกำหนด Data Serialization)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// บันทึก Log การเรียก API เบื้องต้น
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('th-TH');
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// เส้นทาง API (API Routes)
// ==========================================
// 1. เส้นทางระบบยืนยันตัวตนและการเข้าสู่ระบบ (Authentication)
app.use('/api/auth', require('./routes/authRoutes'));

// 2. เส้นทางจัดการงานสิ่งที่ต้องทำ CRUD & Search (To-Do List Management)
app.use('/api/todos', require('./routes/todoRoutes'));

// 3. เส้นทางเชื่อมต่อ External API (Daily Motivational Quotes) (ข้อกำหนด 4.f)
app.use('/api/quotes', require('./routes/quoteRoutes'));

// 4. เส้นทางตรวจสอบสถานะเซิร์ฟเวอร์และการเชื่อมต่อฐานข้อมูล (Health Check)
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'online',
    message: 'To-Do List API (CP363205) is running smoothly',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    endpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      quotes: '/api/quotes',
    },
  });
});

// หน้าต้อนรับสำหรับ Root URL
app.get('/', (req, res) => {
  res.json({
    project: 'CP363205 To-Do List Application API',
    author: 'Computer Science / Engineering Student',
    framework: 'Express on Node.js',
    status: 'Ready',
    docs: '/api/health',
  });
});

// ==========================================
// Error Handling Middleware
// ==========================================
// จัดการข้อผิดพลาด 404 เมื่อไม่พบ Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง API: ${req.method} ${req.originalUrl}`,
  });
});

// จัดการ Exception รวมของระบบ (Global Error Handler)
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
  });
});

// ==========================================
// เริ่มการทำงานของ Server
// ==========================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Back-end Express Server กำลังทำงานที่พอร์ต: http://localhost:${PORT}`);
  console.log(`📋 ตรวจสอบสถานะ API ได้ที่: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

module.exports = app;
