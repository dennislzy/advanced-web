'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { commonContainer, commonItem, commonTitle } from '../style/commonStyle';
import { AuthRoute } from '../authRoute';

type CustomerRow = {
  id: number;
  name: string;
  gender: string | null;
};

const Customer = () => {
  const [list, setList] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog & form
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', gender: '男' });

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => {
    dialogRef.current?.close();
    setError(null);
    setIsEditing(false);
    setEditingId(null);
    setForm({ name: '', gender: '男' });
  };

  // 新增對話框
  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ name: '', gender: '男' });
    openDialog();
  };

  // 編輯對話框
  const openEditFor = (customer: CustomerRow) => {
    setIsEditing(true);
    setEditingId(customer.id);
    setForm({ 
      name: customer.name, 
      gender: customer.gender || '男' 
    });
    openDialog();
  };

  // fetch list from backend API
  async function fetchCustomers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customer');
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
      }
      const json = await res.json();
      const data: CustomerRow[] = Array.isArray(json) ? json : (json.data || []);
      setList(data);
    } catch (err: unknown) {
      console.error('fetchCustomers error', err);
      setError(err instanceof Error ? err.message : '讀取失敗');
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 提交表單 (新增或編輯)
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setError(null);
    
    try {
      if (isEditing && editingId) {
        // 編輯模式
        const res = await fetch('/api/customer', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: editingId, 
            name: form.name.trim(), 
            gender: form.gender 
          }),
        });
        
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
        }
        
        const json = await res.json();
        const updatedRow: CustomerRow = json.data || json;
        
        // 更新列表中的項目
        setList(prev => prev.map(item => 
          item.id === editingId ? updatedRow : item
        ));
        
      } else {
        // 新增模式
        const res = await fetch('/api/customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: form.name.trim(), 
            gender: form.gender 
          }),
        });
        
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
        }
        
        const json = await res.json();
        const newRow: CustomerRow = json.data || json;
        
        // 新增到列表開頭
        setList(prev => [newRow, ...prev]);
      }
      
      closeDialog();
      
    } catch (err: unknown) {
      console.error('submit error', err);
      setError(err instanceof Error ? err.message : isEditing ? '更新失敗' : '新增失敗');
    }
  };

  // 刪除顧客
  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除此顧客嗎?')) return;

    setError(null);
    
    try {
      const res = await fetch('/api/customer', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
      }
      
      // 從列表中移除
      setList(prev => prev.filter(item => item.id !== id));
      
    } catch (err: unknown) {
      console.error('delete error', err);
      setError(err instanceof Error ? err.message : '刪除失敗');
    }
  };

  return (
  <AuthRoute>
    <div style={commonContainer}>
      <h1 style={commonTitle}>Customer Page</h1>

      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#d32f2f',
          padding: '12px 16px',
          marginBottom: 16,
          borderRadius: 6 
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#666' }}>
          讀取中…
        </div>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {list.map((c) => (
            <li key={c.id} style={commonItem}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: '#666', fontSize: 13 }}>{c.gender ?? '—'}</div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    onClick={() => openEditFor(c)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    編輯
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #e0b4b4',
                      background: '#ffdede',
                      color: '#a80000',
                      cursor: 'pointer'
                    }}
                  >
                    刪除
                  </button>
                </div>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li style={{ 
              color: '#666', 
              textAlign: 'center', 
              padding: '40px 0' 
            }}>
              目前沒有資料
            </li>
          )}
        </ul>
      )}

      {/* 回首頁 */}
      <div style={{ marginTop: 24 }}>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '8px 16px', 
            border: '1px solid #ccc', 
            borderRadius: 6,
            textDecoration: 'none',
            color: '#333'
          }}
        >
          回首頁
        </Link>
      </div>

      {/* Floating + button */}
      <button
        aria-label="新增顧客"
        onClick={openAdd}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          fontSize: 28,
          lineHeight: '56px',
          textAlign: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          background: '#1976d2',
          color: 'white',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="新增顧客"
      >
        +
      </button>

      {/* 原生 Dialog */}
      <dialog 
        ref={dialogRef} 
        style={{ 
          border: 'none', 
          borderRadius: 12, 
          padding: 0,
          maxWidth: '90vw',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      >
        <form onSubmit={onSubmit}>
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid #eee', 
            fontWeight: 700, 
            fontSize: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{isEditing ? '編輯顧客' : '新增顧客'}</span>
            <button
              type="button"
              onClick={closeDialog}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#666',
                padding: 0,
                width: 30,
                height: 30
              }}
              aria-label="關閉"
            >
              ×
            </button>
          </div>

          <div style={{ padding: 20, minWidth: 320 }}>
            <label style={{ display: 'block', marginBottom: 16 }}>
              <span style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
                顧客姓名
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="請輸入姓名"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  border: '1px solid #ccc', 
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
                性別
              </span>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  border: '1px solid #ccc', 
                  borderRadius: 6, 
                  background: 'white',
                  fontSize: 14,
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </label>
          </div>

          <div style={{ 
            padding: 16, 
            borderTop: '1px solid #eee', 
            display: 'flex', 
            gap: 8, 
            justifyContent: 'flex-end' 
          }}>
            <button 
              type="button" 
              onClick={closeDialog} 
              style={{ 
                padding: '10px 20px', 
                border: '1px solid #ccc', 
                borderRadius: 6, 
                background: 'white', 
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              取消
            </button>
            <button 
              type="submit" 
              style={{ 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: 6, 
                background: '#1976d2', 
                color: 'white', 
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              {isEditing ? '更新' : '新增'}
            </button>
          </div>
        </form>
      </dialog>
      
    </div>
    </AuthRoute>
  );
};

export default Customer;