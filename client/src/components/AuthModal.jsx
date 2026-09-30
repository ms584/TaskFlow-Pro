/**
 * @file AuthModal.jsx
 * @description คอมโพเนนต์หน้าต่างเข้าสู่ระบบ / ลงทะเบียน
 * มีปุ่ม One-Click Login สำหรับ 2 ผู้ใช้งานจำลองตามข้อกำหนด 4.b
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, quickLoginUser1, quickLoginUser2, demoUsers } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name || !formData.email || !formData.password) {
          setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
          setLoading(false);
          return;
        }
        await register(formData);
      } else {
        if (!formData.email || !formData.password) {
          setError('กรุณากรอกอีเมลและรหัสผ่าน');
          setLoading(false);
          return;
        }
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userType) => {
    setLoading(true);
    setError('');
    try {
      if (userType === 1) {
        await quickLoginUser1();
      } else {
        await quickLoginUser2();
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isRegister ? 'ลงทะเบียนผู้ใช้ใหม่' : 'เข้าสู่ระบบ (Authentication)'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ข้อกำหนด 4.b: ระบบเข้าสู่ระบบอย่างน้อย 2 ผู้ใช้งาน
            </p>
          </div>
          <button className="btn-icon btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Switcher Section (ข้อ 4.b) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-400)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={16} />
            <span>เข้าสู่ระบบด่วน 2 ผู้ใช้สำหรับการประเมิน (Demo Users)</span>
          </div>

          <div className="demo-user-card" onClick={() => handleQuickLogin(1)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=student1"
                alt="User 1"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  User 1: สมชาย ใจดี
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  student1@ku.th (ข้อมูลงานวิจัย & CP363205)
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--primary-400)" />
          </div>

          <div className="demo-user-card" onClick={() => handleQuickLogin(2)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=student2"
                alt="User 2"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  User 2: สมหญิง เรียนเก่ง
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  student2@ku.th (ข้อมูลการอ่านหนังสือ & ซ้อมพรีเซนต์)
                </div>
              </div>
            </div>
            <ArrowRight size={18} color="var(--primary-400)" />
          </div>
        </div>

        <div style={{ textAlign: 'center', position: 'relative', margin: '1rem 0' }}>
          <hr style={{ borderColor: 'var(--border-color)' }} />
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-card)',
              padding: '0 0.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-subtle)',
            }}
          >
            หรือเข้าสู่ระบบด้วยบัญชีอื่น
          </span>
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
                placeholder="สมชาย ใจดี"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">อีเมล</label>
            <input
              type="email"
              className="form-input"
              placeholder="example@ku.th"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'กำลังประมวลผล...' : isRegister ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.825rem' }}>
          {isRegister ? (
            <span>
              มีบัญชีอยู่แล้ว?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-400)', cursor: 'pointer', fontWeight: '600' }}
              >
                เข้าสู่ระบบ
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
                สมัครสมาชิก
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
