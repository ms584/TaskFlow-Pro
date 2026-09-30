/**
 * @module models/Todo
 * @description โมเดลข้อมูลรายการงานสิ่งที่ต้องทำ (Todo Schema) สำหรับระบบ CRUD และ Search
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const mongoose = require('mongoose');

/**
 * นิยาม Todo Schema
 * - user: อ้างอิง ID ของผู้ใช้งาน (User ObjectId) เพื่อให้แต่ละคนเห็นเฉพาะงานของตนเอง (ข้อ 4.b, 4.c)
 * - title: หัวข้อสิ่งที่ต้องทำ (Required)
 * - description: คำอธิบายเพิ่มเติม/โน้ตรายละเอียด
 * - category: หมวดหมู่งาน (Work, Study, Personal, Urgent, Other)
 * - priority: ระดับความสำคัญ (Low, Medium, High)
 * - dueDate: วันที่ครบกำหนดส่งหรือต้องทำเสร็จ
 * - completed: สถานะว่าเสร็จแล้วหรือไม่ (true / false)
 * - completedAt: วันที่และเวลาที่กดยืนยันว่าทำงานเสร็จ
 * - tags: ป้ายกำกับ (Tag) สำหรับช่วยจัดกลุ่มและค้นหา
 */
const TodoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'กรุณาระบุชื่องานที่ต้องทำ'],
      trim: true,
      maxlength: [120, 'ชื่องานต้องมีความยาวไม่เกิน 120 ตัวอักษร'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Work', 'Study', 'Personal', 'Urgent', 'Other'],
      default: 'Personal',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // บันทึก createdAt และ updatedAt อัตโนมัติ
  }
);

// สร้าง Index สำหรับการค้นหา (Text Index) เพื่อเพิ่มประสิทธิภาพการค้นหาตามข้อ 4.c
TodoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Todo', TodoSchema);
