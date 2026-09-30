# โครงสร้าง API (API Map Structure)
**รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์**
**หัวข้อโปรเจกต์:** เว็บแอปพลิเคชันระบบจัดการรายการสิ่งที่ต้องทำ (To-Do List Web Application)

---

## 1. ตารางสรุปภาพรวมของ API Endpoints ทั้งหมด (RESTful API Overview)

| ลำดับ | หมวดหมู่ | HTTP Method | เส้นทาง (Endpoint) | การยืนยันตัวตน (Auth) | หน้าที่การทำงาน |
| :---: | :--- | :---: | :--- | :---: | :--- |
| 1 | Auth | `POST` | `/api/auth/register` | ไม่ต้อง | ลงทะเบียนผู้ใช้งานใหม่ |
| 2 | Auth | `POST` | `/api/auth/login` | ไม่ต้อง | เข้าสู่ระบบ และรับ JWT Token |
| 3 | Auth | `GET` | `/api/auth/me` | Bearer Token | ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน |
| 4 | Auth | `GET` | `/api/auth/demo-users` | ไม่ต้อง | ดึงบัญชี Demo 2 ผู้ใช้งาน (ข้อ 4.b) |
| 5 | To-Do | `GET` | `/api/todos` | Bearer Token | ดึงรายการงาน พร้อมระบบค้นหาและกรอง (ข้อ 4.c) |
| 6 | To-Do | `POST` | `/api/todos` | Bearer Token | เพิ่มรายการสิ่งที่ต้องทำใหม่ (Create) |
| 7 | To-Do | `PUT` | `/api/todos/:id` | Bearer Token | แก้ไขรายละเอียดงาน (Update) |
| 8 | To-Do | `PATCH` | `/api/todos/:id/toggle` | Bearer Token | สลับสถานะเสร็จสิ้น / รอดำเนินการ |
| 9 | To-Do | `DELETE` | `/api/todos/:id` | Bearer Token | ลบรายการงาน (Delete) |
| 10 | External API | `GET` | `/api/quotes/random` | ไม่ต้อง | ดึงคำคมจาก External API (ข้อ 4.f) |
| 11 | Health | `GET` | `/api/health` | ไม่ต้อง | ตรวจสอบสถานะการทำงานและ MongoDB (ข้อ 4.e) |

---

## 2. รายละเอียดของแต่ละ API Endpoint

### 2.1 ระบบยืนยันตัวตน (Authentication)

#### 1) POST `/api/auth/login`
- **คำอธิบาย:** ยืนยันตัวตนด้วยอีเมลและรหัสผ่าน
- **Request Body (JSON):**
```json
{
  "email": "student1@ku.th",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66e100000000000000000001",
      "name": "สมชาย ใจดี (User 1)",
      "email": "student1@ku.th",
      "role": "student",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=student1"
    }
  }
}
```

---

### 2.2 ระบบจัดการงานสิ่งที่ต้องทำ (To-Do Management CRUD & Search)

#### 2) GET `/api/todos` (ค้นหาและอ่านข้อมูล - READ & SEARCH)
- **คำอธิบาย:** ดึงรายการงานของผู้ใช้ที่ล็อกอิน พร้อมรองรับ Query Parameters สำหรับค้นหาและกรอง
- **Query Parameters:**
  - `search` (String): คำค้นหาในชื่อ คำอธิบาย หรือแท็ก
  - `status` (String): `all`, `pending`, `completed`
  - `category` (String): `Study`, `Work`, `Personal`, `Urgent`
  - `priority` (String): `High`, `Medium`, `Low`
  - `sort` (String): `newest`, `dueDate`, `priority`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "stats": {
    "total": 2,
    "completed": 1,
    "pending": 1
  },
  "data": [
    {
      "_id": "66e110000000000000000101",
      "user": "66e100000000000000000001",
      "title": "เตรียมสไลด์นำเสนอวิชา CP363205",
      "description": "เตรียมเนื้อหาและสไลด์สรุป JSON Map Structure และ API Map Structure",
      "category": "Study",
      "priority": "High",
      "dueDate": "2026-09-25T17:00:00.000Z",
      "completed": false,
      "tags": ["Project", "CP363205"],
      "createdAt": "2026-09-23T08:15:00.000Z"
    }
  ]
}
```

#### 3) POST `/api/todos` (สร้างงานใหม่ - CREATE)
- **คำอธิบาย:** เพิ่มรายการสิ่งที่ต้องทำใหม่
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
```json
{
  "title": "ฝึกซ้อมการตอบคำถาม Q&A กับอาจารย์ 5 นาที",
  "description": "เตรียมคำอธิบายการแปลง JSON และการเชื่อมต่อ MongoDB Atlas",
  "category": "Study",
  "priority": "High",
  "dueDate": "2026-09-26T12:00:00.000Z",
  "tags": ["Rehearsal", "QandA"]
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "สร้างรายการใหม่สำเร็จ",
  "data": { ... }
}
```

#### 4) PUT `/api/todos/:id` (แก้ไขข้อมูล - UPDATE)
- **คำอธิบาย:** ปรับปรุงข้อมูลของงานตาม ID ที่ระบุ
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):** ส่งเฉพาะฟิลด์ที่ต้องการแก้ไข เช่น `title`, `priority`, `dueDate`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "อัปเดตข้อมูลสำเร็จ",
  "data": { ... }
}
```

#### 5) PATCH `/api/todos/:id/toggle` (สลับสถานะ - TOGGLE COMPLETE)
- **คำอธิบาย:** สลับสถานะของงานระหว่าง เสร็จสิ้น (completed: true) และ รอดำเนินการ (completed: false)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "เปลี่ยนสถานะเป็น 'เสร็จสิ้น' สำเร็จ",
  "data": {
    "_id": "66e110000000000000000101",
    "completed": true,
    "completedAt": "2026-09-23T08:30:00.000Z"
  }
}
```

#### 6) DELETE `/api/todos/:id` (ลบรายการ - DELETE)
- **คำอธิบาย:** ลบรายการงานออกจากฐานข้อมูล
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "ลบรายการสิ่งที่ต้องทำสำเร็จ",
  "data": {
    "id": "66e110000000000000000101"
  }
}
```

---

### 2.3 การเชื่อมต่อ External API (ข้อ 4.f)

#### 7) GET `/api/quotes/random`
- **คำอธิบาย:** ดึงข้อมูลคำคมสร้างแรงบันดาลใจจาก Third-party API (เช่น dummyjson.com หรือ Productivity Quote API)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "ดึงข้อมูลคำคมจาก External API สำเร็จ (ข้อกำหนด 4.f)",
  "data": {
    "content": "Action is the foundational key to all success.",
    "author": "Pablo Picasso",
    "category": "Motivation",
    "source": "External API (dummyjson.com)"
  }
}
```
