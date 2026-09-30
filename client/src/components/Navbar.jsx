/**
 * @file Navbar.jsx
 * @description คอมโพเนนต์แถบเมนูด้านบน (Header Navigation)
 * มีระบบแสดงโปรไฟล์ผู้ใช้, สลับผู้ใช้ 2 คนอย่างรวดเร็ว (Demo Switcher ข้อ 4.b),
 * สลับธีม Dark/Light mode และปุ่มเปิดหน้าต่างเข้าสู่ระบบ
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Moon, Sun, Users, LogOut, LogIn, Database } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onOpenAuthModal }) {
  const { user, logout, quickLoginUser1, quickLoginUser2 } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [dbInfo, setDbInfo] = useState({ connected: false, name: '' });

  // จัดการการเปลี่ยนธีม Dark / Light
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // เช็คสถานะการเชื่อมต่อฐานข้อมูล MongoDB
  useEffect(() => {
    api.getHealth()
      .then((res) => {
        if (res && res.database) {
          setDbInfo(res.database);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Course Name */}
        <div className="brand">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-title">TaskFlow Pro</span>
              <span className="brand-badge">MERN Stack</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
              CP363205 Data Serialization Project
            </div>
          </div>
        </div>

        {/* Action Controls & User Profile */}
        <div className="nav-actions">
          {/* MongoDB Connection Status Pill */}
          <div
            className="user-pill"
            style={{
              fontSize: '0.75rem',
              color: dbInfo.connected ? '#10b981' : '#f59e0b',
              border: `1px solid ${dbInfo.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            }}
            title={dbInfo.connected ? `เชื่อมต่อ MongoDB: ${dbInfo.name}` : 'กำลังรันในโหมด Memory Fallback'}
          >
            <Database size={14} />
            <span>{dbInfo.connected ? 'MongoDB Active' : 'MongoDB / Fallback'}</span>
          </div>

          {/* Quick User 1 / User 2 Switcher (ข้อ 4.b) */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className={`btn btn-secondary ${user?.email === 'student1@ku.th' ? 'btn-primary' : ''}`}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              onClick={quickLoginUser1}
              title="สลับเป็นผู้ใช้งานที่ 1: สมชาย ใจดี"
            >
              <Users size={14} />
              <span>User 1</span>
            </button>
            <button
              className={`btn btn-secondary ${user?.email === 'student2@ku.th' ? 'btn-primary' : ''}`}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              onClick={quickLoginUser2}
              title="สลับเป็นผู้ใช้งานที่ 2: สมหญิง เรียนเก่ง"
            >
              <Users size={14} />
              <span>User 2</span>
            </button>
          </div>

          {/* Current User Pill */}
          {user ? (
            <div className="user-pill" title={`เข้าสู่ระบบด้วย: ${user.email}`}>
              <img
                src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                alt={user.name}
                className="user-avatar"
              />
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
              <button
                onClick={logout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', marginLeft: '0.2rem' }}
                title="ออกจากระบบ"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuthModal}>
              <LogIn size={15} />
              <span>เข้าสู่ระบบ</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button className="btn-icon btn" onClick={toggleTheme} title="เปลี่ยนธีม">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
