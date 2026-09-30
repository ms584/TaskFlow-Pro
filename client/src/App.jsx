/**
 * @file App.jsx
 * @description คอมโพเนนต์หลักของแอปพลิเคชัน To-Do List (TaskFlow Pro)
 * พร้อมสำหรับการ Deploy จริง มีหน้าต้อนรับ (Landing View) สำหรับผู้ใช้ใหม่
 * และแดชบอร์ดจัดการงานเต็มรูปแบบเมื่อเข้าสู่ระบบ
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import QuoteWidget from './components/QuoteWidget';
import FilterBar from './components/FilterBar';
import TodoItem from './components/TodoItem';
import TodoFormModal from './components/TodoFormModal';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import confetti from 'canvas-confetti';
import {
  ClipboardList,
  Plus,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Shield,
  Layers,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const { user, loading: authLoading } = useAuth();

  // State สำหรับรายการ To-Do และสถิติ
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(false);

  // State สำหรับการค้นหาและตัวกรอง
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // State สำหรับ Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthRegister, setIsAuthRegister] = useState(false);

  // State สำหรับ Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenAuth = (isRegister = false) => {
    setIsAuthRegister(isRegister);
    setIsAuthModalOpen(true);
  };

  /**
   * ฟังก์ชันดึงข้อมูล To-Do ของผู้ใช้ปัจจุบัน
   */
  const fetchTodos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getTodos({
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter,
        sort: sortBy,
      });

      if (res.success) {
        setTodos(res.data);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.warn('โหลด To-Do ล้มเหลว:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchTodos();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [user, fetchTodos]);

  /**
   * สร้างหรือแก้ไข To-Do
   */
  const handleSaveTodo = async (todoData) => {
    try {
      if (editingTodo) {
        const res = await api.updateTodo(editingTodo._id, todoData);
        if (res.success) {
          showToast('บันทึกการแก้ไขเรียบร้อยแล้ว 🎉');
        }
      } else {
        const res = await api.createTodo(todoData);
        if (res.success) {
          showToast('เพิ่มรายการงานใหม่สำเร็จ ✨');
        }
      }
      setIsFormModalOpen(false);
      setEditingTodo(null);
      fetchTodos();
    } catch (err) {
      showToast('เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  /**
   * สลับสถานะเสร็จสิ้น
   */
  const handleToggleTodo = async (id) => {
    try {
      const res = await api.toggleTodo(id);
      if (res.success) {
        const updated = res.data;
        if (updated.completed) {
          showToast('ยินดีด้วย! คุณทำงานนี้เสร็จแล้ว 🏆');
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          });
        }
        fetchTodos();
      }
    } catch (err) {
      showToast('ไม่สามารถเปลี่ยนสถานะได้: ' + err.message);
    }
  };

  /**
   * ลบรายการ To-Do
   */
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('คุณต้องการลบรายการงานนี้ใช่หรือไม่?')) return;

    try {
      const res = await api.deleteTodo(id);
      if (res.success) {
        showToast('ลบรายการงานเรียบร้อยแล้ว');
        fetchTodos();
      }
    } catch (err) {
      showToast('ไม่สามารถลบงานได้: ' + err.message);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsFormModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsFormModalOpen(true);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        กำลังโหลดระบบ...
      </div>
    );
  }

  return (
    <div>
      {/* 1. Navbar */}
      <Navbar onOpenAuthModal={handleOpenAuth} />

      <main className="app-container">
        {user ? (
          /* ==========================================
             LOGGED IN: PERSONAL TASK DASHBOARD
             ========================================== */
          <>
            {/* Header แสดงการต้อนรับผู้ใช้ */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  สวัสดี, {user.name} 👋
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  นี่คือรายการงานที่คุณต้องจัดการในวันนี้ วางแผนและทำให้สำเร็จทีละอย่าง!
                </p>
              </div>
            </div>

            {/* Dashboard Stats */}
            <StatsCard stats={stats} />

            {/* Daily Productivity Quote */}
            <QuoteWidget />

            {/* Controls: Search, Filters, Add Button */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onOpenCreateModal={handleOpenCreateModal}
            />

            {/* To-Do List Cards */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                กำลังโหลดรายการงาน...
              </div>
            ) : todos.length === 0 ? (
              <div className="glass-panel empty-state">
                <ClipboardList className="empty-icon" />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  ไม่พบรายการงาน
                </h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  {searchQuery
                    ? `ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา "${searchQuery}"`
                    : 'เริ่มต้นสร้างงานชิ้นแรกของคุณเพื่อวางแผนงานอย่างมีประสิทธิภาพ'}
                </p>
                <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                  <Plus size={16} />
                  <span>สร้างงานใหม่</span>
                </button>
              </div>
            ) : (
              <div className="todo-list">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* ==========================================
             GUEST VIEW: MODERN LANDING HERO
             ========================================== */
          <div style={{ padding: '2rem 0 4rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: 'var(--primary-400)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={14} />
                <span>Task Management System for High Achievers</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                จัดระเบียบงานและชีวิต <br />
                <span
                  style={{
                    background: 'var(--primary-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ให้สำเร็จได้ทุกวัน
                </span>
              </h1>

              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                TaskFlow Pro ช่วยคุณวางแผนงานสิ่งที่ต้องทำ จัดลำดับความสำคัญ ค้นหาได้รวดเร็ว
                และสร้างวินัยในการทำงานด้วยระบบ MERN Stack ที่ทันสมัยและปลอดภัย
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.8rem 1.85rem', fontSize: '1rem' }}
                  onClick={() => handleOpenAuth(true)}
                >
                  <span>เริ่มต้นใช้งานฟรี</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.8rem 1.85rem', fontSize: '1rem' }}
                  onClick={() => handleOpenAuth(false)}
                >
                  <span>เข้าสู่ระบบที่มีอยู่</span>
                </button>
              </div>
            </div>

            {/* 3 Feature Highlight Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Smart Categorization
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  จัดหมวดหมู่งานอย่างเป็นระบบ ทั้งการเรียน การทำงาน และเรื่องส่วนตัว พร้อมระดับความสำคัญชัดเจน
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Search size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Instant Search & Filters
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  ค้นหารายการงานได้แบบ Real-time และกรองสถานะงานที่รอดำเนินการหรือเสร็จแล้วได้ทันที
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: '#f472b6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Shield size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Secure MongoDB Cloud
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  ข้อมูลงานปลอดภัยด้วย JWT Authentication และจัดเก็บแยกผู้ใช้บน Cloud MongoDB Atlas
                </p>
              </div>
            </div>

            {/* Daily Quote widget on landing */}
            <QuoteWidget />
          </div>
        )}
      </main>

      {/* Form Modal สำหรับสร้าง/แก้ไขงาน */}
      <TodoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />

      {/* Auth Modal สำหรับ Login/Register */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRegister={isAuthRegister}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
