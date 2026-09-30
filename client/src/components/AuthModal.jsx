/**
 * @file AuthModal.jsx
 * @description หน้าต่างเข้าสู่ระบบและสมัครสมาชิกสำหรับ Production
 * รองรับการลงทะเบียนผู้ใช้จริง และมีตัวเลือกกรอกข้อมูลบัญชีทดสอบสำหรับการประเมิน
 */

import React, { useState } from 'react';
import { X, User, Lock, Mail, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialRegister = false }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [showDemoHelp, setShowDemoHelp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // อัปเดตเมื่อเปิด modal
  React.useEffect(() => {
    setIsRegister(initialRegister);
    setError('');
  }, [initialRegister, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
          setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
          setLoading(false);
          return;
        }
        await register(formData);
      } else {
        if (!formData.email.trim() || !formData.password) {
          setError('กรุณากรอกอีเมลและรหัสผ่าน');
          setLoading(false);
          return;
        }
        await login(formData.email.trim(), formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email, password) => {
    setIsRegister(false);
    setFormData({
      ...formData,
      email,
      password,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isRegister ? 'สร้างบัญชีผู้ใช้งานใหม่' : 'เข้าสู่ระบบ TaskFlow Pro'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {isRegister
                ? 'เริ่มต้นจัดการงานและเพิ่มประสิทธิภาพการทำงานของคุณ'
                : 'ยินดีต้อนรับกลับมา กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ'}
            </p>
          </div>
          <button className="btn-icon btn" onClick={onClose}>
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
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">ชื่อ-นามสกุล</label>
              <input
                type="text"
                className="form-input"
                placeholder="เช่น สมชาย ใจดี"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">อีเมล</label>
            <input
              type="email"
              className="form-input"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">รหัสผ่าน</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.7rem' }}
            disabled={loading}
          >
            {loading ? 'กำลังประมวลผล...' : isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem' }}>
          {isRegister ? (
            <span>
              มีบัญชีอยู่แล้ว?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-400)', cursor: 'pointer', fontWeight: '600' }}
              >
                เข้าสู่ระบบที่นี่
              </button>
            </span>
          ) : (
            <span>
              ยังไม่มีบัญชี?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-400)', cursor: 'pointer', fontWeight: '600' }}
              >
                สร้างบัญชีฟรี
              </button>
            </span>
          )}
        </div>

        {/* ตัวช่วยกรอกบัญชีทดสอบสำหรับการประเมิน (Collapsible Accordion) */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
          <button
            type="button"
            onClick={() => setShowDemoHelp(!showDemoHelp)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-subtle)',
              fontSize: '0.775rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.2rem 0',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} />
              <span>บัญชีทดสอบระบบสำหรับผู้ประเมิน (Demo Accounts)</span>
            </span>
            {showDemoHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDemoHelp && (
            <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div
                onClick={() => handleFillDemo('student1@ku.th', 'Password123!')}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>User 1: student1@ku.th</div>
                  <div style={{ color: 'var(--text-muted)' }}>รหัสผ่าน: Password123!</div>
                </div>
                <span style={{ color: 'var(--primary-400)', fontWeight: '600' }}>คลิกเพื่อกรอก</span>
              </div>

              <div
                onClick={() => handleFillDemo('student2@ku.th', 'Password123!')}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>User 2: student2@ku.th</div>
                  <div style={{ color: 'var(--text-muted)' }}>รหัสผ่าน: Password123!</div>
                </div>
                <span style={{ color: 'var(--primary-400)', fontWeight: '600' }}>คลิกเพื่อกรอก</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
