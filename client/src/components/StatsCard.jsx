/**
 * @file StatsCard.jsx
 * @description คอมโพเนนต์แสดงแดชบอร์ดสรุปสถิติจำนวนงานทั้งหมด, รอดำเนินการ, สำเร็จแล้ว และอัตราความสำเร็จ
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React from 'react';
import { ListTodo, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StatsCard({ stats = { total: 0, completed: 0, pending: 0 } }) {
  const { total = 0, completed = 0, pending = 0 } = stats;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      {/* 1. งานทั้งหมด */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper stat-icon-all">
          <ListTodo size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-title">งานทั้งหมด (Total Tasks)</div>
          <div className="stat-value">{total}</div>
        </div>
      </div>

      {/* 2. รอดำเนินการ */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper stat-icon-pending">
          <Clock size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-title">รอดำเนินการ (Pending)</div>
          <div className="stat-value">{pending}</div>
        </div>
      </div>

      {/* 3. เสร็จสมบูรณ์ */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper stat-icon-completed">
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-title">เสร็จแล้ว (Completed)</div>
          <div className="stat-value">{completed}</div>
        </div>
      </div>

      {/* 4. อัตราความสำเร็จ (%) */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper stat-icon-rate">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-title">ความคืบหน้า (Progress)</div>
          <div className="stat-value">{rate}%</div>
          <div className="stat-progress">
            <div className="stat-progress-bar" style={{ width: `${rate}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
