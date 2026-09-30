/**
 * @module controllers/authController
 * @description คอนโทรลเลอร์จัดการระบบยืนยันตัวตน (Authentication)
 * รองรับการลงทะเบียน, เข้าสู่ระบบ, ข้อมูลผู้ใช้ปัจจุบัน และระบบ Demo Users 2 บัญชีตามข้อ 4.b
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDbStatus } = require('../config/db');

// In-memory users store fallback กรณีที่ฐานข้อมูลยังไม่ได้เชื่อมต่อ เพื่อให้เดโมไม่สะดุด
const inMemoryUsers = [
  {
    _id: '66e100000000000000000001',
    name: 'นักศึกษาคนที่ 1 (สมชาย ใจดี)',
    email: 'student1@ku.th',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
    passwordHash: '$2a$10$wK1Wq6Tz5oW8k/4QWp7dOuS9y12fU4o/2bQWJtqH8mEa0jX6m9n9G', // 123456
  },
  {
    _id: '66e100000000000000000002',
    name: 'นักศึกษาคนที่ 2 (สมหญิง เรียนเก่ง)',
    email: 'student2@ku.th',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student2',
    passwordHash: '$2a$10$wK1Wq6Tz5oW8k/4QWp7dOuS9y12fU4o/2bQWJtqH8mEa0jX6m9n9G', // 123456
  },
];

/**
 * ฟังก์ชันสร้าง JSON Web Token (JWT)
 * @param {Object} user - ข้อมูลผู้ใช้
 * @returns {string} Token ที่เข้ารหัสแล้ว
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'cp363205_secret_super_key_jwt_2026';
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
};

/**
 * @function registerUser
 * @description ลงทะเบียนผู้ใช้ใหม่ (POST /api/auth/register)
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, อีเมล, รหัสผ่าน)',
      });
    }

    const { connected } = getDbStatus();

    if (connected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'student',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'ลงทะเบียนผู้ใช้สำเร็จ',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
    } else {
      // In-Memory Fallback
      const userExists = inMemoryUsers.find((u) => u.email === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'อีเมลนี้ถูกใช้งานในระบบแล้ว (In-Memory)',
        });
      }

      const newUser = {
        _id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        role: role || 'student',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      };
      inMemoryUsers.push(newUser);

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'ลงทะเบียนผู้ใช้สำเร็จ (In-Memory Mode)',
        data: {
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
          },
        },
      });
    }
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน: ' + error.message,
    });
  }
};

/**
 * @function loginUser
 * @description เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน (POST /api/auth/login)
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกทั้งอีเมลและรหัสผ่าน',
      });
    }

    const { connected } = getDbStatus();

    if (connected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
    } else {
      // In-Memory Fallback Check
      const user = inMemoryUsers.find((u) => u.email === email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (In-Memory)',
        });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ (In-Memory Mode)',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
    }
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + error.message,
    });
  }
};

/**
 * @function getMe
 * @description ดึงข้อมูลโปรไฟล์ของผู้ใช้งานปัจจุบันจาก Token (GET /api/auth/me)
 */
exports.getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        user: {
          id: req.user._id || req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้',
    });
  }
};

/**
 * @function getDemoAccounts
 * @description ดึงรายการบัญชีผู้ใช้ทดสอบ 2 บัญชีตามข้อกำหนด 4.b สำหรับสลับบัญชีได้ทันที (GET /api/auth/demo-users)
 */
exports.getDemoAccounts = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '66e100000000000000000001',
        name: 'นักศึกษาคนที่ 1 (สมชาย ใจดี)',
        email: 'student1@ku.th',
        defaultPassword: 'Password123!',
        role: 'student',
        description: 'ผู้ใช้งานที่ 1: บันทึกงานด้านการเรียนและโครงงานวิจัย',
      },
      {
        id: '66e100000000000000000002',
        name: 'นักศึกษาคนที่ 2 (สมหญิง เรียนเก่ง)',
        email: 'student2@ku.th',
        defaultPassword: 'Password123!',
        role: 'student',
        description: 'ผู้ใช้งานที่ 2: บันทึกงานส่วนตัวและการเตรียมสอบสัมภาษณ์',
      },
    ],
  });
};
