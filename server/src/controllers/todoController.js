/**
 * @module controllers/todoController
 * @description คอนโทรลเลอร์จัดการ CRUD (Create, Read, Update, Delete) และการค้นหา (Search) รายการสิ่งที่ต้องทำ
 * รองรับการกรองตามสถานะ ความสำคัญ หมวดหมู่ และแยกข้อมูลตามผู้ใช้งาน (User-isolated)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const Todo = require('../models/Todo');
const { getDbStatus } = require('../config/db');

// In-Memory store fallback เพื่อให้ทดสอบเดโมได้ราบรื่นแม้ในเครื่องที่ยังไม่ได้เปิด mongod
let inMemoryTodos = [
  {
    _id: 'todo_demo_101',
    user: '66e100000000000000000001', // ผู้ใช้ 1: สมชาย
    title: 'เตรียมสไลด์นำเสนอวิชา CP363205',
    description: 'เตรียมเนื้อหาและสไลด์สรุป JSON Map Structure และ API Map Structure ไม่เกิน 2-3 สไลด์',
    category: 'Study',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    completed: false,
    tags: ['Project', 'CP363205'],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'todo_demo_102',
    user: '66e100000000000000000001', // ผู้ใช้ 1: สมชาย
    title: 'ทดสอบเชื่อมต่อ MongoDB Atlas และ Compass',
    description: 'ตรวจสอบ connection string และทดสอบฟังก์ชัน CRUD ทั้งหมด',
    category: 'Work',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ['Backend', 'Database'],
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    _id: 'todo_demo_201',
    user: '66e100000000000000000002', // ผู้ใช้ 2: สมหญิง
    title: 'อ่านทบทวน Data Serialization (JSON, XML, YAML)',
    description: 'ทบทวนเพื่อตอบคำถามอาจารย์ช่วง Q&A 5 นาที',
    category: 'Study',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    completed: false,
    tags: ['Exam', 'Theory'],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    _id: 'todo_demo_202',
    user: '66e100000000000000000002', // ผู้ใช้ 2: สมหญิง
    title: 'นัดซ้อมนำเสนอผ่าน Zoom กับเพื่อนในกลุ่ม',
    description: 'ซ้อมจับเวลาพูดไม่เกิน 15 นาทีตามเกณฑ์การนำเสนอ',
    category: 'Personal',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    tags: ['Meeting', 'Rehearsal'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

/**
 * @function getTodos
 * @description ดึงรายการ To-Do ของผู้ใช้ปัจจุบัน พร้อมรองรับการค้นหา (Search) และการกรอง (Filters)
 * Route: GET /api/todos
 * Query params: search, category, priority, status ('all', 'pending', 'completed'), sort
 */
exports.getTodos = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { search, category, priority, status, sort } = req.query;
    const { connected } = getDbStatus();

    if (connected) {
      // สร้าง Query filter สำหรับ MongoDB
      const query = { user: userId };

      // ตัวกรองการค้นหาข้อความ (Search) ตามชื่อและคำอธิบาย
      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }, { tags: regex }];
      }

      // ตัวกรองตามหมวดหมู่ (Category)
      if (category && category !== 'All') {
        query.category = category;
      }

      // ตัวกรองตามระดับความสำคัญ (Priority)
      if (priority && priority !== 'All') {
        query.priority = priority;
      }

      // ตัวกรองตามสถานะเสร็จสิ้น (Status)
      if (status === 'completed') {
        query.completed = true;
      } else if (status === 'pending') {
        query.completed = false;
      }

      // การจัดเรียงลำดับ (Sort)
      let sortOption = { createdAt: -1 }; // ค่าเริ่มต้น: ใหม่สุดก่อน
      if (sort === 'dueDate') {
        sortOption = { dueDate: 1 };
      } else if (sort === 'priority') {
        sortOption = { priority: -1 };
      } else if (sort === 'oldest') {
        sortOption = { createdAt: 1 };
      }

      const todos = await Todo.find(query).sort(sortOption);

      // คำนวณสถิติภาพรวมของผู้ใช้งาน
      const totalAll = await Todo.countDocuments({ user: userId });
      const totalCompleted = await Todo.countDocuments({ user: userId, completed: true });
      const totalPending = totalAll - totalCompleted;

      return res.json({
        success: true,
        count: todos.length,
        stats: {
          total: totalAll,
          completed: totalCompleted,
          pending: totalPending,
        },
        data: todos,
      });
    } else {
      // In-Memory Mode
      let list = inMemoryTodos.filter((t) => String(t.user) === String(userId));

      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        list = list.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'All') {
        list = list.filter((t) => t.category === category);
      }

      if (priority && priority !== 'All') {
        list = list.filter((t) => t.priority === priority);
      }

      if (status === 'completed') {
        list = list.filter((t) => t.completed === true);
      } else if (status === 'pending') {
        list = list.filter((t) => t.completed === false);
      }

      const totalAll = inMemoryTodos.filter((t) => String(t.user) === String(userId)).length;
      const totalCompleted = inMemoryTodos.filter(
        (t) => String(t.user) === String(userId) && t.completed
      ).length;

      return res.json({
        success: true,
        count: list.length,
        stats: {
          total: totalAll,
          completed: totalCompleted,
          pending: totalAll - totalCompleted,
        },
        data: list,
      });
    }
  } catch (error) {
    console.error('[Get Todos Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล To-Do: ' + error.message,
    });
  }
};

/**
 * @function createTodo
 * @description เพิ่มรายการ To-Do ใหม่ (CREATE)
 * Route: POST /api/todos
 */
exports.createTodo = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, description, category, priority, dueDate, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่องานที่ต้องทำ',
      });
    }

    const { connected } = getDbStatus();

    if (connected) {
      const todo = await Todo.create({
        user: userId,
        title: title.trim(),
        description: description || '',
        category: category || 'Personal',
        priority: priority || 'Medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: Array.isArray(tags) ? tags : [],
        completed: false,
      });

      return res.status(201).json({
        success: true,
        message: 'สร้างรายการใหม่สำเร็จ',
        data: todo,
      });
    } else {
      // In-Memory Mode
      const newTodo = {
        _id: 'todo_' + Date.now(),
        user: userId,
        title: title.trim(),
        description: description || '',
        category: category || 'Personal',
        priority: priority || 'Medium',
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tags: Array.isArray(tags) ? tags : [],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryTodos.unshift(newTodo);

      return res.status(201).json({
        success: true,
        message: 'สร้างรายการใหม่สำเร็จ (In-Memory)',
        data: newTodo,
      });
    }
  } catch (error) {
    console.error('[Create Todo Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้าง To-Do: ' + error.message,
    });
  }
};

/**
 * @function updateTodo
 * @description แก้ไขข้อมูลรายการ To-Do (UPDATE)
 * Route: PUT /api/todos/:id
 */
exports.updateTodo = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { title, description, category, priority, dueDate, completed, tags } = req.body;
    const { connected } = getDbStatus();

    if (connected) {
      const todo = await Todo.findOne({ _id: id, user: userId });
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบรายการที่ต้องการแก้ไข หรือคุณไม่มีสิทธิ์แก้ไขรายการนี้',
        });
      }

      if (title !== undefined) todo.title = title.trim();
      if (description !== undefined) todo.description = description;
      if (category !== undefined) todo.category = category;
      if (priority !== undefined) todo.priority = priority;
      if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;
      if (tags !== undefined) todo.tags = Array.isArray(tags) ? tags : [];
      if (completed !== undefined) {
        todo.completed = completed;
        todo.completedAt = completed ? new Date() : null;
      }

      const updatedTodo = await todo.save();

      return res.json({
        success: true,
        message: 'อัปเดตข้อมูลสำเร็จ',
        data: updatedTodo,
      });
    } else {
      // In-Memory Mode
      const index = inMemoryTodos.findIndex(
        (t) => String(t._id) === String(id) && String(t.user) === String(userId)
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบรายการที่ต้องการแก้ไข (In-Memory)',
        });
      }

      const existing = inMemoryTodos[index];
      const updated = {
        ...existing,
        title: title !== undefined ? title.trim() : existing.title,
        description: description !== undefined ? description : existing.description,
        category: category !== undefined ? category : existing.category,
        priority: priority !== undefined ? priority : existing.priority,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate).toISOString() : null) : existing.dueDate,
        completed: completed !== undefined ? completed : existing.completed,
        completedAt: completed ? new Date().toISOString() : null,
        tags: tags !== undefined ? tags : existing.tags,
        updatedAt: new Date().toISOString(),
      };

      inMemoryTodos[index] = updated;

      return res.json({
        success: true,
        message: 'อัปเดตข้อมูลสำเร็จ (In-Memory)',
        data: updated,
      });
    }
  } catch (error) {
    console.error('[Update Todo Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดต To-Do: ' + error.message,
    });
  }
};

/**
 * @function toggleComplete
 * @description สลับสถานะเสร็จสิ้น / รอดำเนินการ (TOGGLE COMPLETE)
 * Route: PATCH /api/todos/:id/toggle
 */
exports.toggleComplete = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      const todo = await Todo.findOne({ _id: id, user: userId });
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบรายการที่ต้องการเปลี่ยนสถานะ',
        });
      }

      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date() : null;
      await todo.save();

      return res.json({
        success: true,
        message: `เปลี่ยนสถานะเป็น "${todo.completed ? 'เสร็จสิ้น' : 'รอดำเนินการ'}" สำเร็จ`,
        data: todo,
      });
    } else {
      // In-Memory Mode
      const index = inMemoryTodos.findIndex(
        (t) => String(t._id) === String(id) && String(t.user) === String(userId)
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบรายการที่ต้องการเปลี่ยนสถานะ (In-Memory)',
        });
      }

      const item = inMemoryTodos[index];
      item.completed = !item.completed;
      item.completedAt = item.completed ? new Date().toISOString() : null;
      item.updatedAt = new Date().toISOString();

      return res.json({
        success: true,
        message: `เปลี่ยนสถานะเป็น "${item.completed ? 'เสร็จสิ้น' : 'รอดำเนินการ'}" สำเร็จ`,
        data: item,
      });
    }
  } catch (error) {
    console.error('[Toggle Complete Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ' + error.message,
    });
  }
};

/**
 * @function deleteTodo
 * @description ลบรายการ To-Do (DELETE)
 * Route: DELETE /api/todos/:id
 */
exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { connected } = getDbStatus();

    if (connected) {
      const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบรายการที่ต้องการลบ หรือคุณไม่มีสิทธิ์ลบรายการนี้',
        });
      }

      return res.json({
        success: true,
        message: 'ลบรายการสิ่งที่ต้องทำสำเร็จ',
        data: { id: todo._id },
      });
    } else {
      // In-Memory Mode
      const initialLength = inMemoryTodos.length;
      inMemoryTodos = inMemoryTodos.filter(
        (t) => !(String(t._id) === String(id) && String(t.user) === String(userId))
      );

      if (inMemoryTodos.length === initialLength) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบรายการที่ต้องการลบ (In-Memory)',
        });
      }

      return res.json({
        success: true,
        message: 'ลบรายการสิ่งที่ต้องทำสำเร็จ (In-Memory)',
        data: { id },
      });
    }
  } catch (error) {
    console.error('[Delete Todo Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบ To-Do: ' + error.message,
    });
  }
};
