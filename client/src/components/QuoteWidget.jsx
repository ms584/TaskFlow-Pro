/**
 * @file QuoteWidget.jsx
 * @description คอมโพเนนต์แสดงคำคมสร้างแรงบันดาลใจและข้อคิดการจัดการเวลา
 * เชื่อมต่อกับ External API (ตามข้อกำหนดของรายวิชาข้อ 4.f)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';
import { api } from '../services/api';

export default function QuoteWidget() {
  const [quote, setQuote] = useState({
    content: 'กำลังโหลดข้อความสร้างแรงบันดาลใจ...',
    author: 'Loading...',
    category: 'Productivity',
    source: 'External API',
  });
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await api.getRandomQuote();
      if (res.success && res.data) {
        setQuote(res.data);
      }
    } catch (err) {
      console.warn('ดึงข้อมูลคำคมล้มเหลว:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="glass-panel quote-widget">
      <div className="quote-header">
        <div className="quote-tag">
          <Sparkles size={14} />
          <span>Daily Inspiration & Productivity (External API - ข้อ 4.f)</span>
        </div>
        <button
          className="btn-icon btn"
          style={{ width: '30px', height: '30px' }}
          onClick={fetchQuote}
          disabled={loading}
          title="สุ่มคำคมใหม่จาก External API"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="quote-text">
        "{quote.content}"
      </div>

      <div className="quote-author">
        <span>— {quote.author}</span>
        {quote.source && <span className="quote-source">{quote.source}</span>}
      </div>
    </div>
  );
}
