/**
 * @file App.jsx
 * @description คอมโพเนนต์หลักของแอปพลิเคชัน To-Do List (TaskFlow Pro)
 * รวบรวมฟังก์ชัน CRUD, ค้นหา (Search), สลับผู้ใช้งาน (User Switcher), สถิติ และ External API
 * รายวิชา CP363205 ภาษาอนุกรมข้อมูลและการประยุกต์
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
import { ClipboardList, Plus, Sparkles, CheckCircle } from 'lucide-react';

export default function App() {
  const { user } = useAuth();

  // State สำหรับรายการ To-Do และสถิติ
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(false);

  // State สำหรับการค้นหาและตัวกรอง (ข้อ 4.c)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // State สำหรับ Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // State สำหรับ Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  /**
   * ฟังก์ชันดึงข้อมูล To-Do จาก Back-end ตามเงื่อนไขการค้นหาและฟิลเตอร์
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

  // โหลด To-Do ใหม่ทุกครั้งที่ผู้ใช้เปลี่ยน หรือเมื่อค่าค้นหา/ฟิลเตอร์เปลี่ยน
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTodos();
    }, 200); // Debounce search 200ms

    return () => clearTimeout(timer);
  }, [fetchTodos]);

  /**
   * ฟังก์ชันสร้างหรือแก้ไข To-Do (CREATE / UPDATE)
   */
  const handleSaveTodo = async (todoData) => {
    try {
      if (editingTodo) {
        // แก้ไข (UPDATE)
        const res = await api.updateTodo(editingTodo._id, todoData);
        if (res.success) {
          showToast('บันทึกการแก้ไขรายการงานสำเร็จ 🎉');
        }
      } else {
        // สร้างใหม่ (CREATE)
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
   * ฟังก์ชันสลับสถานะเสร็จสิ้น / รอดำเนินการ (TOGGLE COMPLETE)
   */
  const handleToggleTodo = async (id) => {
    try {
      const res = await api.toggleTodo(id);
      if (res.success) {
        const updated = res.data;
        if (updated.completed) {
          showToast('ยินดีด้วย! ทำงานเสร็จเรียบร้อย 🏆');
          // แสดง Effect พลุกระดาษฉลอง
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
   * ฟังก์ชันลบรายการ To-Do (DELETE)
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

  /**
   * เปิด Modal สำหรับแก้ไข
   */
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsFormModalOpen(true);
  };

  /**
   * เปิด Modal สำหรับสร้างใหม่
   */
  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsFormModalOpen(true);
  };

  return (
    <div>
      {/* 1. Navbar พร้อม User Switcher */}
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="app-container">
        {/* 2. การ์ดสรุปสถิติจำนวนงาน (Dashboard Statistics) */}
        <StatsCard stats={stats} />

        {/* 3. คำคมสร้างแรงบันดาลใจจาก External API (ข้อ 4.f) */}
        <QuoteWidget />

        {/* 4. กล่องค้นหาและตัวกรอง (ข้อ 4.c) */}
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

        {/* 5. รายการสิ่งที่ต้องทำ (To-Do List Cards) */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            กำลังโหลดข้อมูลงาน...
          </div>
        ) : todos.length === 0 ? (
          <div className="glass-panel empty-state">
            <ClipboardList className="empty-icon" />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              ไม่พบรายการสิ่งที่ต้องทำ
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
      </main>

      {/* 6. หน้าต่างเพิ่ม/แก้ไขรายการงาน */}
      <TodoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />

      {/* 7. หน้าต่างเข้าสู่ระบบ/สลับผู้ใช้งาน (Authentication) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 8. Toast Alert แจ้งเตือนสถานะ */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
