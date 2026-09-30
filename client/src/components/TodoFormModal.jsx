/**
 * @file TodoFormModal.jsx
 * @description คอมโพเนนต์หน้าต่างป๊อปอัป (Modal) สำหรับเพิ่ม (Create) หรือแก้ไข (Update) รายการ To-Do
 * รองรับการกรอกชื่อ, รายละเอียด, หมวดหมู่, ระดับความสำคัญ, วันที่กำหนดส่ง, และป้ายกำกับ
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, Calendar, Tag, AlertCircle } from 'lucide-react';

export default function TodoFormModal({ isOpen, onClose, onSave, editingTodo }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Study',
    priority: 'Medium',
    dueDate: '',
    tags: '',
  });

  const [error, setError] = useState('');

  // เมื่อเปิดหน้าต่างหรือเปลี่ยน editingTodo ให้นำข้อมูลเดิมมาใส่ในฟอร์ม
  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title || '',
        description: editingTodo.description || '',
        category: editingTodo.category || 'Study',
        priority: editingTodo.priority || 'Medium',
        dueDate: editingTodo.dueDate ? editingTodo.dueDate.split('T')[0] : '',
        tags: editingTodo.tags ? editingTodo.tags.join(', ') : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Study',
        priority: 'Medium',
        dueDate: '',
        tags: '',
      });
    }
    setError('');
  }, [editingTodo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('กรุณาระบุชื่องานที่ต้องทำ');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        : [],
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingTodo ? 'แก้ไขรายการงาน (Edit Task)' : 'เพิ่มรายการงานใหม่ (New Task)'}
          </h2>
          <button className="btn-icon btn" onClick={onClose} title="ปิดหน้าต่าง">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ชื่องาน */}
          <div className="form-group">
            <label className="form-label">ชื่องานที่ต้องทำ *</label>
            <input
              type="text"
              className="form-input"
              placeholder="เช่น ส่งรายงานความคืบหน้ารายวิชา CP363205"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              autoFocus
            />
          </div>

          {/* รายละเอียดเพิ่มเติม */}
          <div className="form-group">
            <label className="form-label">คำอธิบาย / โน้ตย่อ</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="ระบุรายละเอียดเพิ่มเติม หรือลิงก์ที่เกี่ยวข้อง..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* แถวคู่: หมวดหมู่ และ ระดับความสำคัญ */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">หมวดหมู่ (Category)</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Study">📚 การเรียน (Study)</option>
                <option value="Work">💼 การทำงาน (Work)</option>
                <option value="Personal">🏡 ส่วนตัว (Personal)</option>
                <option value="Urgent">🔥 ด่วนมาก (Urgent)</option>
                <option value="Other">📌 อื่นๆ (Other)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ระดับความสำคัญ (Priority)</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">🔴 สูง (High)</option>
                <option value="Medium">🟡 ปานกลาง (Medium)</option>
                <option value="Low">🟢 ทั่วไป (Low)</option>
              </select>
            </div>
          </div>

          {/* แถวคู่: วันที่ครบกำหนด และ แท็ก */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">กำหนดส่ง (Due Date)</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ป้ายกำกับ (Tags คั่นด้วยจุลภาค)</label>
              <input
                type="text"
                className="form-input"
                placeholder="CP363205, Presentation, Exam"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{editingTodo ? 'บันทึกการแก้ไข' : 'สร้างรายการงาน'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
