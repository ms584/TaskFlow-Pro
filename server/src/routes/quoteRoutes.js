/**
 * @module routes/quoteRoutes
 * @description เส้นทาง API สำหรับเชื่อมต่อ External API (ข้อ 4.f)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

const express = require('express');
const router = express.Router();
const { getRandomQuote } = require('../controllers/quoteController');

// Route: สุ่มคำคมสร้างแรงบันดาลใจจาก External API
router.get('/random', getRandomQuote);

module.exports = router;
