/**
 * @file FilterBar.jsx
 * @description คอมโพเนนต์แถบควบคุมการค้นหา (Search) และตัวกรอง (Filters) รายการงาน
 * ตอบโจทย์ข้อ 4.c: ค้นหาข้อมูลได้ที่สอดคล้องกับผู้ใช้งาน
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onOpenCreateModal,
}) {
  return (
    <div className="glass-panel controls-panel">
      {/* Search Input and Add New Task Button */}
      <div className="search-and-action">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่องาน, คำอธิบาย, หรือป้ายกำกับ (Search todos)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={onOpenCreateModal}>
          <Plus size={18} />
          <span>เพิ่มงานใหม่ (New Task)</span>
        </button>
      </div>

      {/* Filter Tabs & Dropdowns */}
      <div className="filter-row">
        {/* Status Filter Tabs (All / Pending / Completed) */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            ทั้งหมด (All)
          </button>
          <button
            className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            รอดำเนินการ (Pending)
          </button>
          <button
            className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            เสร็จแล้ว (Done)
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="filter-dropdowns">
          {/* หมวดหมู่ (Category) */}
          <select
            className="select-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            title="กรองตามหมวดหมู่"
          >
            <option value="All">ทุกหมวดหมู่ (All Categories)</option>
            <option value="Study">📚 การเรียน (Study)</option>
            <option value="Work">💼 การทำงาน (Work)</option>
            <option value="Personal">🏡 ส่วนตัว (Personal)</option>
            <option value="Urgent">🔥 ด่วนมาก (Urgent)</option>
          </select>

          {/* ระดับความสำคัญ (Priority) */}
          <select
            className="select-input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            title="กรองตามระดับความสำคัญ"
          >
            <option value="All">ทุกระดับความสำคัญ (All Priorities)</option>
            <option value="High">🔴 สูง (High)</option>
            <option value="Medium">🟡 ปานกลาง (Medium)</option>
            <option value="Low">🟢 ทั่วไป (Low)</option>
          </select>

          {/* การเรียงลำดับ (Sort) */}
          <select
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="จัดเรียงลำดับ"
          >
            <option value="newest">⏱️ ล่าสุดก่อน (Newest)</option>
            <option value="dueDate">📅 กำหนดส่งใกล้สุด (Due Date)</option>
            <option value="priority">⚡ ความสำคัญ (Priority)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
