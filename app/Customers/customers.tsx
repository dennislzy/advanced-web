'use client'
import { useState } from 'react'
import { List, ListItemButton, ListItemText, Paper } from '@mui/material'
import { blue } from '@mui/material/colors'

export default function CustomerList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const customers = [
    { id: 'c1', name: '王小明', level: 'Gold' },
    { id: 'c2', name: '陳語彤', level: 'Silver' }
  ]

  return (
    <Paper sx={{ bgcolor: blue[50], p: 2 }}>
      <List>
        {customers.map((c) => (
          <ListItemButton
            key={c.id}
            selected={selectedId === c.id}
            onClick={() => setSelectedId(c.id)}
          >
            <ListItemText primary={c.name} secondary={c.level} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
}
