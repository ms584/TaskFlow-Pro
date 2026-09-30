/**
 * @file AuthContext.jsx
 * @description Context จัดการข้อมูลสถานะการเข้าสู่ระบบของผู้ใช้งาน (Authentication State)
 * รองรับการสลับบัญชีผู้ใช้ 2 คนได้อย่างรวดเร็วสำหรับการนำเสนอ (Demo Switcher)
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);

  // โหลดข้อมูลผู้ใช้เมื่อเริ่มเปิดแอป
  useEffect(() => {
    const initAuth = async () => {
      // โหลดรายชื่อผู้ใช้ Demo สำหรับทดสอบ
      try {
        const demoRes = await api.getDemoUsers();
        if (demoRes.success) {
          setDemoUsers(demoRes.data);
        }
      } catch (err) {
        console.warn('ไม่สามารถโหลด Demo Users ได้:', err.message);
      }

      // หากมี Token ค้างอยู่ ให้ตรวจสอบความถูกต้องของ Token
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Token หมดอายุหรือไม่ถูกต้อง ทำการ Logout:', err.message);
          logout();
        }
      }
      // หากไม่มี token ให้คงสถานะ user เป็น null เพื่อแสดงหน้า Welcome / Login ตามมาตรฐานแอปจริง
      setLoading(false);
    };

    initAuth();
  }, []);

  /** เข้าสู่ระบบ */
  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  /** ลงทะเบียน */
  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  /** ออกจากระบบ */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /** สลับเข้าสู่ระบบด้วย User 1 (สมชาย ใจดี) */
  const quickLoginUser1 = async () => {
    try {
      await login('student1@ku.th', 'Password123!');
    } catch (err) {
      // Fallback local dummy user if backend is booting
      const dummy1 = {
        id: '66e100000000000000000001',
        name: 'สมชาย ใจดี (User 1)',
        email: 'student1@ku.th',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
      };
      setUser(dummy1);
    }
  };

  /** สลับเข้าสู่ระบบด้วย User 2 (สมหญิง เรียนเก่ง) */
  const quickLoginUser2 = async () => {
    try {
      await login('student2@ku.th', 'Password123!');
    } catch (err) {
      const dummy2 = {
        id: '66e100000000000000000002',
        name: 'สมหญิง เรียนเก่ง (User 2)',
        email: 'student2@ku.th',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=student2',
      };
      setUser(dummy2);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoUsers,
        login,
        register,
        logout,
        quickLoginUser1,
        quickLoginUser2,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
