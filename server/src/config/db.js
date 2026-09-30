/**
 * @module config/db
 * @description โมดูลสำหรับจัดการการเชื่อมต่อฐานข้อมูล MongoDB (รองรับทั้ง MongoDB Atlas และ MongoDB Compass)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const mongoose = require('mongoose');

// ตัวแปรเก็บสถานะการเชื่อมต่อฐานข้อมูล
let isConnected = false;

/**
 * ฟังก์ชัน connectDB: ทำการเชื่อมต่อกับ MongoDB ผ่าน Mongoose
 * รองรับ Connection string จากตัวแปรสภาพแวดล้อม (Environment Variable) MONGODB_URI
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist_cp363205';

  try {
    // กำหนด options สำหรับ Mongoose connection
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Timeout 4 วินาทีเพื่อไม่ให้ค้างนานหากยังไม่ได้เปิด MongoDB
    });

    isConnected = true;
    console.log(`[Database] เชื่อมต่อ MongoDB สำเร็จ: ${conn.connection.host}`);
    console.log(`[Database] ฐานข้อมูลที่ใช้งาน: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`\n[Database Warning] ไม่สามารถเชื่อมต่อกับ MongoDB ได้ในขณะนี้ (${error.message})`);
    console.warn(`[คำแนะนำ]:`);
    console.warn(`1. หากใช้ MongoDB Compass ในเครื่อง ให้เปิดโปรแกรม Compass และ Start Service mongod`);
    console.warn(`2. หรือหากใช้ MongoDB Atlas ให้นำ Connection String มาวางในไฟล์ server/.env ที่ตัวแปร MONGODB_URI`);
    console.warn(`3. ระบบเปิดโหมด Smart In-Memory Store อัตโนมัติ เพื่อให้สามารถรัน Demo และทดสอบ CRUD ได้ทันที\n`);
  }
};

/**
 * ฟังก์ชันเช็คสถานะการเชื่อมต่อ MongoDB
 * @returns {boolean} สถานะว่าเชื่อมต่อกับ MongoDB สำเร็จหรือไม่
 */
const getDbStatus = () => {
  return {
    connected: isConnected,
    host: isConnected ? mongoose.connection.host : 'Memory Fallback Store',
    name: isConnected ? mongoose.connection.name : 'In-Memory DB',
  };
};

module.exports = { connectDB, getDbStatus };
