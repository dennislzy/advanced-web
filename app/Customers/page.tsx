import Link from 'next/link'
import { commonContainer, commonItem, commonPrice, commonTitle } from '../style/commonStyle'

export const customersList = [
  { id: 'c1', name: '王小明', level: 'Gold' },
  { id: 'c2', name: '陳語彤', level: 'Silver' }
]

const Customer = () => {
  return (
    <div style={commonContainer}>
      <h1 style={commonTitle}>customer Page</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {customersList.map((common) => (
          <li key={common.id} style={commonItem}>
            <span>{common.name}</span>
            <span style={commonPrice}>{common.level}</span>
          </li>
        ))}
      </ul>

      {/* 回首頁 */}
      <div style={{ marginTop: 16 }}>
        <Link href="/" style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: 6 }}>
          回首頁
        </Link>
      </div>
    </div>
  )
}

export default Customer
