'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { commonContainer, commonItem, commonPrice, commonTitle } from '../style/commonStyle';

type CustomerRow = {
  id: number;
  name: string;
  gender: string;
};

const Customer = () => {
  const [list, setList] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog & form
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({ name: '', gender: '男' });

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => {
    dialogRef.current?.close();
    setError(null); // 關閉時清除錯誤
  };

  // fetch customers from backend API
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
      // 修復:處理不同的回傳格式
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setError(null); // 提交前清除錯誤
    
    try {
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), gender: form.gender }),
      });
      
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
      }
      
      const json = await res.json();
      // 修復:處理不同的回傳格式
      const newRow: CustomerRow = json.data || json;
      
      // prepend to list
      setList(prev => [newRow, ...prev]);
      setForm({ name: '', gender: '男' });
      closeDialog();
    } catch (err: unknown) {
      console.error('insert error', err);
      setError(err instanceof Error ? err.message : '新增失敗');
    }
  };

  return (
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
              <span>{c.name}</span>
              <span style={commonPrice}>{c.gender}</span>
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

      {/* 浮動 + 按鈕 */}
      <button
        aria-label="新增顧客"
        onClick={openDialog}
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
            <span>新增顧客</span>
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
              新增
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Customer;