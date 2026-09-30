/**
 * @file api.js
 * @description เซอร์วิสสำหรับติดต่อสื่อสารกับ Back-end RESTful API (Express)
 * รองรับการแนบ Bearer JWT Token อัตโนมัติสำหรับการยืนยันตัวตน
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

// รองรับทั้ง Localhost Proxy และ Production URL บน Render ผ่าน VITE_API_URL
const API_ORIGIN = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';
const BASE_URL = `${API_ORIGIN}/api`;

/**
 * ฟังก์ชันกลางสำหรับส่ง HTTP Request
 * @param {string} endpoint - พาธของ API เช่น '/todos'
 * @param {Object} options - ตัวเลือก fetch (method, headers, body)
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'เกิดข้อผิดพลาดในการเรียก API');
  }

  return data;
}

export const api = {
  // ==========================================
  // Authentication API (ข้อ 4.b)
  // ==========================================
  /** เข้าสู่ระบบ */
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /** ลงทะเบียนผู้ใช้ใหม่ */
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  /** ดึงข้อมูลผู้ใช้ปัจจุบัน */
  getMe: () => request('/auth/me'),

  /** ดึงข้อมูล 2 บัญชีทดสอบสำหรับนำเสนอ */
  getDemoUsers: () => request('/auth/demo-users'),

  // ==========================================
  // To-Do Management API (CRUD + Search) (ข้อ 4.c)
  // ==========================================
  /** ดึงรายการ To-Do พร้อมการค้นหาและกรอง (READ) */
  getTodos: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/todos${queryString}`);
  },

  /** สร้างรายการ To-Do ใหม่ (CREATE) */
  createTodo: (todoData) =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    }),

  /** แก้ไขข้อมูล To-Do (UPDATE) */
  updateTodo: (id, todoData) =>
    request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    }),

  /** สลับสถานะเสร็จสิ้น / รอดำเนินการ (TOGGLE COMPLETE) */
  toggleTodo: (id) =>
    request(`/todos/${id}/toggle`, {
      method: 'PATCH',
    }),

  /** ลบรายการ To-Do (DELETE) */
  deleteTodo: (id) =>
    request(`/todos/${id}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // External API (ข้อ 4.f)
  // ==========================================
  /** ดึงคำคมสร้างแรงบันดาลใจจาก External API */
  getRandomQuote: () => request('/quotes/random'),

  /** ตรวจสอบสถานะการเชื่อมต่อเซิร์ฟเวอร์และ MongoDB (ข้อ 4.e) */
  getHealth: () => request('/health'),
};
