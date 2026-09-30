/**
 * @file seed.js
 * @description สคริปต์สำหรับ Seeding ข้อมูลเริ่มต้นลงสู่ MongoDB Atlas/Compass
 * สร้าง 2 บัญชีผู้ใช้งานและตัวอย่าง To-Do รายการงานตามข้อกำหนดข้อ 4.b
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Todo = require('./models/Todo');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist_cp363205';

  try {
    console.log('[Seed] กำลังเชื่อมต่อไปยัง MongoDB:', uri);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] เชื่อมต่อสำเร็จ เริ่มต้นเคลียร์ข้อมูลเดิม...');

    // ลบข้อมูลเดิมออกก่อน
    await User.deleteMany({});
    await Todo.deleteMany({});

    console.log('[Seed] กำลังสร้าง 2 บัญชีผู้ใช้งานจำลอง (ข้อ 4.b)...');

    // 1. ผู้ใช้งานคนที่ 1
    const user1 = await User.create({
      name: 'สมชาย ใจดี (User 1)',
      email: 'student1@ku.th',
      password: 'Password123!',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
    });

    // 2. ผู้ใช้งานคนที่ 2
    const user2 = await User.create({
      name: 'สมหญิง เรียนเก่ง (User 2)',
      email: 'student2@ku.th',
      password: 'Password123!',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student2',
    });

    console.log(`[Seed] สร้างผู้ใช้งานสำเร็จ: ${user1.email} และ ${user2.email}`);

    console.log('[Seed] กำลังสร้างรายการ To-Do ตัวอย่างสำหรับผู้ใช้ทั้งสอง...');

    // สร้างงานสำหรับ User 1
    await Todo.create([
      {
        user: user1._id,
        title: 'เตรียมสไลด์นำเสนอวิชา CP363205',
        description: 'ทำสไลด์สรุป JSON Map Structure และ API Map Structure ไม่เกิน 2-3 สไลด์ตามเกณฑ์',
        category: 'Study',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 2),
        completed: false,
        tags: ['Project', 'CP363205'],
      },
      {
        user: user1._id,
        title: 'ทดสอบเชื่อมต่อ MongoDB Atlas และ Compass',
        description: 'ตรวจสอบ connection string และทดสอบฟังก์ชัน CRUD ทั้งหมด',
        category: 'Work',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 1),
        completed: true,
        completedAt: new Date(Date.now() - 3600000 * 2),
        tags: ['Backend', 'Database'],
      },
      {
        user: user1._id,
        title: 'ทดสอบระบบสลับ 2 ผู้ใช้งาน (User Isolation)',
        description: 'ตรวจสอบว่า User 1 มองไม่เห็นงานของ User 2',
        category: 'Work',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 3),
        completed: false,
        tags: ['Security', 'Auth'],
      },
    ]);

    // สร้างงานสำหรับ User 2
    await Todo.create([
      {
        user: user2._id,
        title: 'อ่านทบทวน Data Serialization (JSON, XML, YAML)',
        description: 'ทบทวนเพื่อตอบคำถามอาจารย์ช่วง Q&A 5 นาที',
        category: 'Study',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 3),
        completed: false,
        tags: ['Exam', 'Theory'],
      },
      {
        user: user2._id,
        title: 'นัดซ้อมนำเสนอออนไลน์กับเพื่อนในกลุ่ม',
        description: 'ซ้อมจับเวลากลุ่มละ 15 นาที และถามตอบ 5 นาที',
        category: 'Personal',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 4),
        completed: true,
        completedAt: new Date(Date.now() - 3600000 * 1),
        tags: ['Meeting', 'Rehearsal'],
      },
    ]);

    console.log('[Seed] เติมข้อมูลเริ่มต้นสมบูรณ์เรียบร้อยแล้ว!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
};

seedData();
