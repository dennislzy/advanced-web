'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { commonContainer, commonItem, commonPrice, commonTitle } from '../style/commonStyle';

type Gender = 'MALE' | 'FEMALE';
type Customer = { id: number; name: string; gender: Gender };

export default function CustomerPage() {
  const [list, setList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入 Supabase 顧客資料
  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer')
        .select('id, name, gender')
        .order('id', { ascending: true });

      if (error) {
        console.error(error);
        setError('讀取資料時發生錯誤');
      } else {
        setList(data as Customer[]);
      }
      setLoading(false);
    }

    fetchCustomers();
  }, []);

  return (
    <div style={commonContainer}>
      <h1 style={commonTitle}>Customer</h1>

      {loading && <p>讀取中...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {/* 顧客清單 */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {list.map((c) => (
          <li key={c.id} style={commonItem}>
            <span>{c.name}</span>
            <span style={commonPrice}>{c.gender}</span>
          </li>
        ))}
      </ul>

      {/* 回首頁 */}
      <div style={{ marginTop: 16 }}>
        <Link
          href="/"
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: 6,
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
        }}
        title="新增顧客"
      >
        +
      </button>

      {/* 原生 Dialog（需 'use client'） */}
      <dialog ref={dialogRef} style={{ border: 'none', borderRadius: 12, padding: 0 }}>
        <form onSubmit={onSubmit}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #eee',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            新增顧客
          </div>

          <div style={{ padding: 20, minWidth: 320 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              顧客姓名
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="請輸入姓名"
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  marginTop: 6,
                  border: '1px solid #ccc',
                  borderRadius: 6,
                }}
              />
            </label>

            <label style={{ display: 'block', marginTop: 12 }}>
              會員等級
              <select
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  marginTop: 6,
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  background: 'white',
                }}
              >
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </select>
            </label>
          </div>

          <div
            style={{
              padding: 16,
              borderTop: '1px solid #eee',
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={closeDialog}
              style={{
                padding: '8px 14px',
                border: '1px solid #ccc',
                borderRadius: 6,
                background: 'white',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: 6,
                background: '#1976d2',
                color: 'white',
                cursor: 'pointer',
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
