# โครงสร้างข้อมูล JSON (JSON Map Structure)
**รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์**
**หัวข้อโปรเจกต์:** เว็บแอปพลิเคชันระบบจัดการรายการสิ่งที่ต้องทำ (To-Do List Web Application)

---

## 1. บทนำ (Introduction)
ในรายวิชา **CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์** การแปลงโครงสร้างข้อมูลในโปรแกรมให้อยู่ในรูปแบบ **JSON (JavaScript Object Notation)** เพื่อใช้รับ-ส่งข้อมูลระหว่าง Client (React Front-end) และ Server (Node.js & Express Back-end) รวมถึงการจัดเก็บในฐานข้อมูล Document-oriented (MongoDB) ถือเป็นหัวใจสำคัญ 

เอกสารนี้ระบุรายละเอียดโครงสร้าง JSON ทั้งหมดที่ใช้งานจริงในระบบตามข้อกำหนดข้อ 3.d

---

## 2. โครงสร้าง JSON ของผู้ใช้งาน (User Schema JSON)
ใช้สำหรับการจัดเก็บข้อมูลผู้ใช้ในระบบ และการทำ Authentication ผ่าน JWT

```json
{
  "_id": "66e100000000000000000001",
  "name": "สมชาย ใจดี (User 1)",
  "email": "student1@ku.th",
  "password": "$2a$10$wK1Wq6Tz5oW8k/4QWp7dOuS9y12fU4o/2bQWJtqH8mEa0jX6m9n9G",
  "role": "student",
  "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=student1",
  "createdAt": "2026-09-23T08:00:00.000Z",
  "updatedAt": "2026-09-23T08:00:00.000Z",
  "__v": 0
}
```

### คำอธิบายฟิลด์ (Data Dictionary):
| ฟิลด์ | ชนิดข้อมูล | จำเป็น | รายละเอียด |
| :--- | :--- | :---: | :--- |
| `_id` | String / ObjectId | ใช่ | รหัสประจำตัวเฉพาะของผู้ใช้งาน (Unique Identifier) |
| `name` | String | ใช่ | ชื่อ-นามสกุลของผู้ใช้งาน (ไม่เกิน 50 ตัวอักษร) |
| `email` | String | ใช่ | อีเมลที่ใช้ล็อกอิน (Unique, Lowercase) |
| `password` | String | ใช่ | รหัสผ่านที่ผ่านการเข้ารหัสแฮชด้วยอัลกอริทึม bcrypt (Salt 10 rounds) |
| `role` | String (Enum) | ใช่ | สิทธิ์การใช้งาน (`student`, `teacher`, `admin`) |
| `avatar` | String (URL) | ไม่ | ลิงก์รูปภาพโปรไฟล์ประจำตัว (SVG Avatar) |
| `createdAt` | ISO 8601 Date | ใช่ | วันที่และเวลาที่สร้างบัญชีผู้ใช้ |
| `updatedAt` | ISO 8601 Date | ใช่ | วันที่และเวลาที่มีการแก้ไขข้อมูลล่าสุด |

---

## 3. โครงสร้าง JSON ของรายการสิ่งที่ต้องทำ (To-Do Item JSON)
ใช้สำหรับจัดเก็บงานแต่ละชิ้น โดยมีการเชื่อมโยงกับ `user` ผ่าน ObjectId เพื่อแยกข้อมูลระหว่างผู้ใช้แต่ละคน (User Isolation ตามข้อ 4.b, 4.c)

```json
{
  "_id": "66e110000000000000000101",
  "user": "66e100000000000000000001",
  "title": "เตรียมสไลด์นำเสนอวิชา CP363205",
  "description": "เตรียมเนื้อหาและสไลด์สรุป JSON Map Structure และ API Map Structure ไม่เกิน 2-3 สไลด์",
  "category": "Study",
  "priority": "High",
  "dueDate": "2026-09-25T17:00:00.000Z",
  "completed": false,
  "completedAt": null,
  "tags": [
    "Project",
    "CP363205"
  ],
  "createdAt": "2026-09-23T08:15:00.000Z",
  "updatedAt": "2026-09-23T08:15:00.000Z",
  "__v": 0
}
```

### คำอธิบายฟิลด์ (Data Dictionary):
| ฟิลด์ | ชนิดข้อมูล | จำเป็น | รายละเอียด |
| :--- | :--- | :---: | :--- |
| `_id` | String / ObjectId | ใช่ | รหัสประจำตัวเฉพาะของรายการงาน |
| `user` | String / ObjectId | ใช่ | Foreign Key อ้างอิงไปยัง `_id` ของ User เจ้าของงาน |
| `title` | String | ใช่ | หัวข้องานที่ต้องทำ (ไม่เกิน 120 ตัวอักษร) |
| `description` | String | ไม่ | คำอธิบายรายละเอียดเพิ่มเติมหรือโน้ตย่อ |
| `category` | String (Enum) | ใช่ | หมวดหมู่งาน (`Study`, `Work`, `Personal`, `Urgent`, `Other`) |
| `priority` | String (Enum) | ใช่ | ระดับความสำคัญ (`Low`, `Medium`, `High`) |
| `dueDate` | ISO 8601 Date | ไม่ | วันและเวลาที่กำหนดส่งงาน |
| `completed` | Boolean | ใช่ | สถานะการทำงาน (`false` = รอดำเนินการ, `true` = เสร็จสิ้น) |
| `completedAt` | ISO 8601 Date | ไม่ | เวลาที่กดยืนยันทำเครื่องหมายเสร็จสิ้น |
| `tags` | Array of Strings | ไม่ | ป้ายกำกับสำหรับจัดกลุ่มหรือค้นหาเพิ่มเติม |

---

## 4. โครงสร้าง JSON ของข้อมูลที่ดึงจาก External API (ข้อ 4.f)
ระบบทำการเชื่อมต่อกับ Third-party API เพื่อดึงข้อความสร้างแรงบันดาลใจในการทำงานและเรียนหนังสือ

```json
{
  "content": "Action is the foundational key to all success.",
  "author": "Pablo Picasso",
  "category": "Motivation",
  "source": "External API (dummyjson.com)"
}
```

---

## 5. รูปแบบมาตรฐานของการตอบกลับ API (Standard API Response Structure)

### 5.1 กรณีสำเร็จ (Success Response)
```json
{
  "success": true,
  "message": "ข้อความอธิบายผลลัพธ์",
  "count": 2,
  "stats": {
    "total": 3,
    "completed": 1,
    "pending": 2
  },
  "data": [ ... ]
}
```

### 5.2 กรณีเกิดข้อผิดพลาด (Error Response)
```json
{
  "success": false,
  "message": "คำอธิบายสาเหตุของข้อผิดพลาด เช่น อีเมลนี้ถูกใช้งานในระบบแล้ว"
}
```
