'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, FormEvent } from 'react';
import { commonContainer, commonItem, commonTitle } from '../style/commonStyle';

type CustomerRow = {
  id: number;
  name: string;
  gender: string | null;
};

export default function CustomerPage() {
  const [list, setList] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // for Add dialog (native)
  const addDialogRef = useRef<HTMLDialogElement>(null);
  const [addForm, setAddForm] = useState({ name: '', gender: '男' });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // for Edit dialog (native)
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [editForm, setEditForm] = useState<{ id?: number; name: string; gender: string }>({ id: undefined, name: '', gender: '男' });
  const [submittingEdit, setSubmittingEdit] = useState(false);

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
      const data: CustomerRow[] = await res.json();
      setList(Array.isArray(data) ? data : []);
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

  // Add
  const openAdd = () => addDialogRef.current?.showModal();
  const closeAdd = () => {
    addDialogRef.current?.close();
    setError(null);
    setAddForm({ name: '', gender: '男' });
  };

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    setSubmittingAdd(true);
    setError(null);
    try {
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addForm.name.trim(), gender: addForm.gender }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
      }
      const newRow: CustomerRow = await res.json();
      setList(prev => [newRow, ...prev]);
      closeAdd();
    } catch (err: unknown) {
      console.error('add error', err);
      setError(err instanceof Error ? err.message : '新增失敗');
    } finally {
      setSubmittingAdd(false);
    }
  }

  // Edit
  const openEditFor = (c: CustomerRow) => {
    setEditForm({ id: c.id, name: c.name, gender: c.gender ?? '男' });
    editDialogRef.current?.showModal();
  };
  const closeEdit = () => {
    editDialogRef.current?.close();
    setError(null);
    setEditForm({ id: undefined, name: '', gender: '男' });
  };

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.id) return;
    setSubmittingEdit(true);
    setError(null);
    try {
      const res = await fetch('/api/customer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editForm.id, name: editForm.name.trim(), gender: editForm.gender }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? j?.message ?? `HTTP ${res.status}`);
      }
      const updated: CustomerRow = await res.json();
      setList(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      closeEdit();
    } catch (err: unknown) {
      console.error('edit error', err);
      setError(err instanceof Error ? err.message : '更新失敗');
    } finally {
      setSubmittingEdit(false);
    }
  }

  // Delete
  async function handleDelete(id: number) {
    if (!confirm('確定要刪除此顧客嗎？此動作不可回復。')) return;
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
      // remove from list
      setList(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      console.error('delete error', err);
      setError(err instanceof Error ? err.message : '刪除失敗');
    }
  }

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
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="新增顧客"
      >
        +
      </button>

      {/* Add dialog (native) */}
      <dialog
        ref={addDialogRef}
        style={{
          border: 'none',
          borderRadius: 12,
          padding: 0,
          maxWidth: '90vw',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      >
        <form onSubmit={handleAdd}>
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
            <button type="button" onClick={closeAdd} style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#666',
              padding: 0,
              width: 30,
              height: 30
            }} aria-label="關閉">×</button>
          </div>

          <div style={{ padding: 20, minWidth: 320 }}>
            <label style={{ display: 'block', marginBottom: 16 }}>
              <span style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>顧客姓名</span>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
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
              <span style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>性別</span>
              <select
                value={addForm.gender}
                onChange={(e) => setAddForm(f => ({ ...f, gender: e.target.value }))}
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
            <button type="button" onClick={closeAdd} style={{
              padding: '10px 20px',
              border: '1px solid #ccc',
              borderRadius: 6,
              background: 'white',
              cursor: 'pointer',
              fontSize: 14
            }}>取消</button>
            <button type="submit" style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              background: '#1976d2',
              color: 'white',
              cursor: 'pointer',
              fontSize: 14
            }} disabled={submittingAdd}>{submittingAdd ? '新增中…' : '新增'}</button>
          </div>
        </form>
      </dialog>

      {/* Edit dialog (native) */}
      <dialog
        ref={editDialogRef}
        style={{
          border: 'none',
          borderRadius: 12,
          padding: 0,
          maxWidth: '90vw',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      >
        <form onSubmit={handleEdit}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            fontWeight: 700,
            fontSize: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>編輯顧客</span>
            <button type="button" onClick={closeEdit} style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#666',
              padding: 0,
              width: 30,
              height: 30
            }} aria-label="關閉">×</button>
          </div>

          <div style={{ padding: 20, minWidth: 320 }}>
            <label style={{ display: 'block', marginBottom: 16 }}>
              <span style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>顧客姓名</span>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
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
              <span style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>性別</span>
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm(f => ({ ...f, gender: e.target.value }))}
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
            <button type="button" onClick={closeEdit} style={{
              padding: '10px 20px',
              border: '1px solid #ccc',
              borderRadius: 6,
              background: 'white',
              cursor: 'pointer',
              fontSize: 14
            }}>取消</button>
            <button type="submit" style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              background: '#1976d2',
              color: 'white',
              cursor: 'pointer',
              fontSize: 14
            }} disabled={submittingEdit}>{submittingEdit ? '儲存中…' : '儲存'}</button>
          </div>
        </form>
      </dialog>

    </div>
  );
}
