/**
 * @module middleware/authMiddleware
 * @description มิดเดิลแวร์สำหรับตรวจสอบ JSON Web Token (JWT) เพื่อยืนยันตัวตนของผู้ใช้งาน (Authentication)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDbStatus } = require('../config/db');

/**
 * ฟังก์ชัน protect: ตรวจสอบ Bearer Token จาก Request Header
 * หาก Token ถูกต้อง จะแนบข้อมูลผู้ใช้งานลงใน req.user
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express Next function
 */
const protect = async (req, res, next) => {
  let token;

  // ตรวจสอบว่ามี Authorization Header และขึ้นต้นด้วย "Bearer" หรือไม่
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // สกัดเอาตัว Token ออกมาจากสตริง "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // ถอดรหัสและตรวจสอบความถูกต้องของ Token ด้วย JWT_SECRET
      const secret = process.env.JWT_SECRET || 'cp363205_secret_super_key_jwt_2026';
      const decoded = jwt.verify(token, secret);

      const { connected } = getDbStatus();

      if (connected) {
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล โดยไม่นำ password ส่งกลับมา (-password)
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'ไม่พบข้อมูลผู้ใช้นี้ในระบบ',
          });
        }
        req.user = user;
      } else {
        // กรณี In-memory fallback
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email || 'user@example.com',
          role: decoded.role || 'student',
        };
      }

      next();
    } catch (error) {
      console.error('[Auth Error] Token ไม่ถูกต้องหรือหมดอายุ:', error.message);
      return res.status(401).json({
        success: false,
        message: 'การเข้าถึงไม่ถูกต้อง หรือเซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'ไม่พบ Token การเข้าสู่ระบบ กรุณาแนบ Authorization Header',
    });
  }
};

module.exports = { protect };
