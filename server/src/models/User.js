/**
 * @module models/User
 * @description โมเดลข้อมูลผู้ใช้งาน (User Schema) สำหรับระบบ Authentication และแยก To-Do ตามผู้ใช้
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * นิยาม User Schema
 * - name: ชื่อของผู้ใช้งาน
 * - email: อีเมล (ใช้เป็น Username สำหรับ Login มีการตรวจสอบ unique)
 * - password: รหัสผ่าน (ผ่านการเข้ารหัสแบบ bcrypt แฮชก่อนบันทึกลงฐานข้อมูล)
 * - avatar: รูปภาพโปรไฟล์ประจำตัว
 * - role: สิทธิ์การใช้งานของผู้ใช้ เช่น 'student', 'admin'
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'กรุณาระบุชื่อผู้ใช้งาน'],
      trim: true,
      maxlength: [50, 'ชื่อต้องมีความยาวไม่เกิน 50 ตัวอักษร'],
    },
    email: {
      type: String,
      required: [true, 'กรุณาระบุอีเมล'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'กรุณาระบุรูปแบบอีเมลที่ถูกต้อง',
      ],
    },
    password: {
      type: String,
      required: [true, 'กรุณาระบุรหัสผ่าน'],
      minlength: [6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'],
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/bottts/svg?seed=user1',
    },
  },
  {
    timestamps: true, // บันทึก createdAt และ updatedAt อัตโนมัติ
  }
);

/**
 * Middleware ก่อนบันทึกข้อมูล (Pre-save Hook):
 * ทำการ Hash รหัสผ่านด้วย bcrypt ก่อนจะเก็บลงฐานข้อมูล MongoDB หากมีการเปลี่ยนแปลงรหัสผ่าน
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * เมธอด comparePassword: เปรียบเทียบรหัสผ่านที่ส่งเข้ามาจากตอน Login กับรหัสผ่านที่แฮชไว้ในฐานข้อมูล
 * @param {string} candidatePassword - รหัสผ่านที่ผู้ใช้กรอก
 * @returns {Promise<boolean>} ผลการตรวจสอบว่าถูกต้องหรือไม่
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
