import { Button, Box, Typography } from '@mui/material'
import Link from 'next/link'
import CustomerList from './customers'

export default function CustomersPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>顧客列表</Typography>
      <CustomerList />
      <Box sx={{ mt: 2 }}>
        <Button component={Link} href="/" variant="outlined">回首頁</Button>
      </Box>
    </Box>
  )
}
