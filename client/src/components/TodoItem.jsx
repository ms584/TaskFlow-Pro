/**
 * @file TodoItem.jsx
 * @description คอมโพเนนต์แสดงรายการงาน To-Do แต่ละรายการ
 * รองรับการทำเครื่องหมายเสร็จ (Toggle Complete), แก้ไข (Edit), และลบ (Delete)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React from 'react';
import { Check, Edit2, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const isCompleted = todo.completed;

  // ตรวจสอบวันครบกำหนดว่าเลยกำหนดหรือไม่ (Overdue)
  const isOverdue =
    todo.dueDate &&
    !isCompleted &&
    new Date(todo.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  // แปลงรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  // ดึงคลาสของ Priority Badge
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
      default:
        return 'badge-priority-low';
    }
  };

  return (
    <div className={`glass-panel todo-item ${isCompleted ? 'completed' : ''}`}>
      {/* Checkbox สำหรับ Toggle Status */}
      <button
        className={`checkbox-btn ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(todo._id)}
        title={isCompleted ? 'คลิกเพื่อเปลี่ยนเป็นรอดำเนินการ' : 'คลิกเพื่อทำเครื่องหมายว่าเสร็จแล้ว'}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      {/* ข้อมูลเนื้อหางาน */}
      <div className="todo-body">
        <h3 className={`todo-title ${isCompleted ? 'completed' : ''}`}>
          {todo.title}
        </h3>

        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}

        {/* Metadata: Category, Priority, Due Date, Tags */}
        <div className="todo-meta">
          {/* Priority Badge */}
          <span className={`badge ${getPriorityClass(todo.priority)}`}>
            {todo.priority === 'High' && '🔥 '}
            {todo.priority === 'Medium' && '⚡ '}
            {todo.priority === 'Low' && '🌱 '}
            {todo.priority}
          </span>

          {/* Category Badge */}
          <span className="badge badge-category">
            {todo.category}
          </span>

          {/* Due Date */}
          {todo.dueDate && (
            <span className={`badge ${isOverdue ? 'badge-date overdue' : 'badge-date'}`}>
              <Calendar size={12} />
              <span>{formatDate(todo.dueDate)}</span>
              {isOverdue && <span title="เลยกำหนดส่งแล้ว">(เกินกำหนด)</span>}
            </span>
          )}

          {/* Tags */}
          {todo.tags &&
            todo.tags.map((tag, idx) => (
              <span key={idx} className="todo-tag">
                #{tag}
              </span>
            ))}
        </div>
      </div>

      {/* Action Buttons: Edit & Delete */}
      <div className="todo-actions">
        <button
          className="btn-icon btn"
          onClick={() => onEdit(todo)}
          title="แก้ไขข้อมูล (Edit)"
        >
          <Edit2 size={15} />
        </button>
        <button
          className="btn-icon btn btn-danger"
          onClick={() => onDelete(todo._id)}
          title="ลบรายการ (Delete)"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
