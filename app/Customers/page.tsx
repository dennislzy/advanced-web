'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  commonContainer,
  commonItem,
  commonPrice,
  commonTitle,
} from '../style/commonStyle'

type Gender = 'MALE' | 'FEMALE'

type Customer = {
  id: string
  name: string
  gender: Gender
}

const seedCustomers: Customer[] = [
  { id: 'c1', name: '王小明', gender: 'MALE' },
  { id: 'c2', name: '陳語彤', gender: 'FEMALE' },
]

export default function CustomerPage() {
  const [list, setList] = useState<Customer[]>(seedCustomers)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('MALE')
  const [error, setError] = useState<string | null>(null)

  function handleAdd() {
    setError(null)

    if (!name.trim()) {
      setError('請輸入顧客名稱')
      return
    }

    const newItem: Customer = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      gender,
    }

    setList((prev) => [newItem, ...prev])
    setName('')
    setGender('MALE')
  }

  return (
    <div style={commonContainer}>
      <h1 style={commonTitle}>Customer</h1>

      {/* 新增顧客表單 */}
      <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
        <input
          placeholder="顧客名稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 6, flex: 1 }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          style={{ padding: 6 }}
        >
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>

        <button onClick={handleAdd} style={{ padding: '6px 12px' }}>
          新增
        </button>
      </div>

      {error && (
        <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>
      )}

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
  )
}
