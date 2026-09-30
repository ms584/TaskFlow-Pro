/**
 * @module routes/authRoutes
 * @description เส้นทาง API สำหรับระบบยืนยันตัวตน (Authentication Routes)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getDemoAccounts,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Route: ลงทะเบียนผู้ใช้ใหม่
router.post('/register', registerUser);

// Route: เข้าสู่ระบบ (Login)
router.post('/login', loginUser);

// Route: ตรวจสอบข้อมูลผู้ใช้ปัจจุบัน (ต้องมี Token)
router.get('/me', protect, getMe);

// Route: ดึงรายชื่อ 2 บัญชีทดสอบสำหรับเดโม (ข้อ 4.b)
router.get('/demo-users', getDemoAccounts);

module.exports = router;
