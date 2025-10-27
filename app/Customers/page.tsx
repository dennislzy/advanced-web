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
    </div>
  );
}
