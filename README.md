# TaskFlow Pro | MERN Stack To-Do List Application
**รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์**

เว็บแอปพลิเคชันระบบจัดการรายการสิ่งที่ต้องทำ (To-Do List / Task Management Web App) พัฒนาด้วยสถาปัตยกรรม **MERN Stack** (MongoDB, Express.js, React, Node.js) ตอบโจทย์เกณฑ์การประเมินโครงการทุกข้ออย่างสมบูรณ์แบบ

---

## 🌟 จุดเด่นและฟังก์ชันที่ตอบโจทย์รายวิชา (Project Highlights)

| ข้อกำหนด (Course Criteria) | การตอบโจทย์ในระบบนี้ |
| :--- | :--- |
| **4.a สอดคล้องกับหัวข้อ To-Do List** | ออกแบบระบบ Task Management เสมือนจริง มีหมวดหมู่ (Study, Work, Personal, Urgent), ระดับความสำคัญ (High, Med, Low), กำหนดวันเสร็จ, ป้ายกำกับ Tags |
| **4.b ระบบเข้าสู่ระบบอย่างน้อย 2 ผู้ใช้งาน** | มีระบบ JWT Authentication + ปุ่ม **One-Click Quick Switcher** สลับระหว่าง `User 1: สมชาย (student1@ku.th)` และ `User 2: สมหญิง (student2@ku.th)` ข้อมูลงานแยกจากกันเด็ดขาด (User Isolation) |
| **4.c ส่วนจัดการข้อมูล CRUD และค้นหา (Search)** | - **Create:** เพิ่มงานใหม่<br>- **Read:** แสดงรายการงานและ Dashboard Stats<br>- **Update:** แก้ไขรายละเอียด และปุ่มทำเครื่องหมายเสร็จสิ้น<br>- **Delete:** ลบงาน<br>- **Search:** ค้นหา Real-time ตามชื่อ/คำอธิบาย/แท็ก และกรองตามหมวดหมู่/ความสำคัญ |
| **4.d Back-end ใช้ Express Framework เท่านั้น** | พัฒนาด้วย Express.js 4 บน Node.js พร้อม Routing, Controller, Middleware ที่ได้มาตรฐาน |
| **4.e เชื่อมต่อ MongoDB Compass หรือ Atlas** | รองรับทั้ง **MongoDB Atlas (Cloud URI)** และ **MongoDB Compass (Local URI)** ใน `server/.env` พร้อม Fallback Store อัจฉริยะที่ทำให้ทดสอบระบบได้ทันทีโดยไม่ติดขัด |
| **4.f เชื่อมต่อ External API อย่างน้อย 1 API** | เชื่อมต่อ **Daily Motivational & Productivity Quotes API** จากภายนอก เพื่อแสดงข้อคิดและแรงบันดาลใจในการทำงานประจำวัน |
| **7. Comment อธิบายโค้ดทุก Module/Function** | ใส่คอมเมนต์ภาษาไทยอธิบายทุกโมเดล (Models), คอนโทรลเลอร์ (Controllers), มิดเดิลแวร์ (Middlewares), และคอมโพเนนต์ (Components) เพื่อให้เข้าใจและนำเสนอได้ง่าย |

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Quick Start Guide)

### 1. วิธีการรันระบบ Back-end (Server)
เปิด Terminal หน้าต่างที่ 1 แล้วรันคำสั่ง:
```bash
cd server
npm run dev
```
เซิร์ฟเวอร์จะทำงานที่: `http://localhost:5000`  
ตรวจสอบสถานะ API และฐานข้อมูลได้ที่: `http://localhost:5000/api/health`

### 2. วิธีการรันระบบ Front-end (Client)
เปิด Terminal หน้าต่างที่ 2 แล้วรันคำสั่ง:
```bash
cd client
npm run dev
```
เว็บแอปพลิเคชันจะเปิดทำงานที่: `http://localhost:5173`

---

## 🍃 การตั้งค่าฐานข้อมูล MongoDB (Atlas หรือ Compass)

ไฟล์การตั้งค่าจะอยู่ที่ `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todolist_cp363205
JWT_SECRET=cp363205_secret_super_key_jwt_2026
```

- **หากใช้งาน MongoDB Compass ในเครื่อง:**  
  เปิดโปรแกรม MongoDB Compass แล้วเชื่อมต่อผ่าน `mongodb://127.0.0.1:27017`
- **หากใช้งาน MongoDB Atlas บน Cloud:**  
  นำ Connection String เช่น `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/todolist_cp363205` มาวางแทนที่ค่า `MONGODB_URI` ในไฟล์ `server/.env`

*(หมายเหตุ: หากยังไม่ได้เปิด MongoDB ตัวระบบจะมีระบบ In-Memory Demo อัตโนมัติ เพื่อให้ผู้ตรวจสามารถทดสอบฟังก์ชันบนเว็บได้ทันทีโดยไม่มี Error)*

---

## 👥 บัญชีผู้ใช้งานสำหรับการทดสอบเดโม (Demo Accounts)

ระบบเตรียมปุ่มลัดสลับผู้ใช้บน Navbar ให้คลิกทดสอบได้ทันที:
1. **User 1 (สมชาย ใจดี):**
   - อีเมล: `student1@ku.th`
   - รหัสผ่าน: `Password123!`
   - งานตัวอย่าง: เตรียมสไลด์นำเสนอวิชา CP363205, ทดสอบฐานข้อมูล MongoDB
2. **User 2 (สมหญิง เรียนเก่ง):**
   - อีเมล: `student2@ku.th`
   - รหัสผ่าน: `Password123!`
   - งานตัวอย่าง: อ่านทบทวน Data Serialization, นัดซ้อมนำเสนอผ่าน Zoom

---

## 📑 เอกสารสนับสนุนการทำเล่มรายงานและสไลด์นำเสนอ

เอกสารสำหรับการจัดทำเล่มรายงานสมบูรณ์ตามหัวข้อข้อ 3 และ 6 จัดเตรียมไว้ที่:
- [JSON Map Structure (docs/JSON_MAP_STRUCTURE.md)](docs/JSON_MAP_STRUCTURE.md): อธิบายโครงสร้างข้อมูล JSON สำหรับนำไปใส่ในหัวข้อ 3.d
- [API Map Structure (docs/API_MAP_STRUCTURE.md)](docs/API_MAP_STRUCTURE.md): ตารางและสเปกการเรียก API ทุก Endpoint สำหรับหัวข้อ 3.e
