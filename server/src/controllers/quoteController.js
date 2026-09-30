/**
 * @module controllers/quoteController
 * @description คอนโทรลเลอร์เชื่อมต่อกับ External API (ตามข้อกำหนด 4.f)
 * ทำหน้าที่ดึงข้อมูลคำคมสร้างแรงบันดาลใจและข้อคิดการจัดการเวลาจากภายนอก
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

// คำคมสร้างแรงบันดาลใจและเพิ่มประสิทธิภาพในการเรียน/ทำงาน (Fallback Quotes)
const localMotivationalQuotes = [
  {
    content: "ความสำเร็จไม่ได้มาจากการทำสิ่งใหญ่เป็นครั้งคราว แต่มาจากการทำสิ่งเล็กๆ อย่างสม่ำเสมอทุกวัน",
    author: "James Clear (Atomic Habits)",
    category: "Productivity",
    source: "Productivity Engine",
  },
  {
    content: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Motivation",
    source: "Productivity Engine",
  },
  {
    content: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "Action",
    source: "Productivity Engine",
  },
  {
    content: "อย่ารอให้ถึงวันพรุ่งนี้ เพื่อทำสิ่งที่คุณสามารถทำให้เสร็จได้ในวันนี้",
    author: "Benjamin Franklin",
    category: "Time Management",
    source: "Productivity Engine",
  },
  {
    content: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "Focus",
    source: "Productivity Engine",
  },
  {
    content: "การเขียน To-Do List คือก้าวแรกในการเปลี่ยนเป้าหมายในจินตนาการให้กลายเป็นความจริง",
    author: "CP363205 Motivation",
    category: "Organization",
    source: "Productivity Engine",
  },
];

/**
 * @function getRandomQuote
 * @description ดึงข้อมูลคำคมจาก External API (ตามข้อ 4.f) พร้อมระบบ Fallback
 * Route: GET /api/quotes/random
 */
exports.getRandomQuote = async (req, res) => {
  try {
    // ทดลองดึงจาก External API: dummyjson.com quotes
    // Node 18+ มี global fetch ในตัว
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    let externalData = null;

    try {
      const response = await fetch('https://dummyjson.com/quotes/random', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        externalData = {
          content: json.quote,
          author: json.author,
          category: 'Motivation',
          source: 'External API (dummyjson.com)',
        };
      }
    } catch (apiErr) {
      // หากเกิดข้อผิดพลาดในการเรียก External API
      // console.log('[External API Note]: ใช้ Fallback Quote');
    }

    if (externalData) {
      return res.json({
        success: true,
        message: 'ดึงข้อมูลคำคมจาก External API สำเร็จ (ข้อกำหนด 4.f)',
        data: externalData,
      });
    }

    // หากไม่สามารถดึงจาก External API ได้ ใช้ Fallback คำคมคุณภาพสูง
    const randomIndex = Math.floor(Math.random() * localMotivationalQuotes.length);
    const selectedQuote = localMotivationalQuotes[randomIndex];

    return res.json({
      success: true,
      message: 'ดึงข้อมูลคำคมสร้างแรงบันดาลใจสำเร็จ',
      data: selectedQuote,
    });
  } catch (error) {
    console.error('[Quote Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงคำคม: ' + error.message,
    });
  }
};
