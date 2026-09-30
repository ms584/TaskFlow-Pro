/**
 * @module routes/todoRoutes
 * @description เส้นทาง API สำหรับจัดการรายการ To-Do (CRUD และ Search)
 * ทุกเส้นทางได้รับการป้องกันด้วย protect middleware เพื่อให้แยกงานตามผู้ใช้
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleComplete,
  deleteTodo,
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// กำหนดให้ทุก Route ของ To-Do ต้องยืนยันตัวตน (Authentication Required)
router.use(protect);

// Route: ดึงรายการ To-Do พร้อมการค้นหาและกรอง (GET /api/todos)
// Route: สร้าง To-Do รายการใหม่ (POST /api/todos)
router.route('/')
  .get(getTodos)
  .post(createTodo);

// Route: สลับสถานะเสร็จสิ้น / รอดำเนินการ (PATCH /api/todos/:id/toggle)
router.patch('/:id/toggle', toggleComplete);

// Route: แก้ไขรายละเอียด To-Do (PUT /api/todos/:id)
// Route: ลบรายการ To-Do (DELETE /api/todos/:id)
router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;
