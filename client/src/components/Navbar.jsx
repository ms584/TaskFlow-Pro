/**
 * @file Navbar.jsx
 * @description คอมโพเนนต์แถบเมนูด้านบน (Header Navigation) สำหรับ Production
 * แสดงโปรไฟล์ผู้ใช้จริง, ปุ่มเข้าสู่ระบบ/สมัครสมาชิก, สลับธีม Dark/Light mode
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Moon, Sun, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar({ onOpenAuthModal }) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // จัดการการเปลี่ยนธีม Dark / Light
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Product Name */}
        <div className="brand">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-title">TaskFlow Pro</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
              Smart Task & Productivity Management
            </div>
          </div>
        </div>

        {/* Action Controls & User Profile */}
        <div className="nav-actions">
          {/* Current User Pill or Login/Register Buttons */}
          {user ? (
            <div className="user-pill" title={`เข้าสู่ระบบด้วย: ${user.email}`}>
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                alt={user.name}
                className="user-avatar"
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ fontWeight: '600', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  {user.email}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-subtle)',
                  marginLeft: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => onOpenAuthModal(false)}>
                <LogIn size={15} />
                <span>เข้าสู่ระบบ</span>
              </button>
              <button className="btn btn-primary" onClick={() => onOpenAuthModal(true)}>
                <UserPlus size={15} />
                <span>สมัครสมาชิก</span>
              </button>
            </div>
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
