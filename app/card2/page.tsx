import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function BasicCard() {
  return (
    <Card sx={{ maxWidth: 500,
         backgroundColor: '#f5f5',
         transition: '0.3s',
         borderRadius: 3,    
         minHeight: '30vh',              
        display: 'flex',
        justifyContent: 'center',       
        alignItems: 'center',       
     }
    }>
      <CardContent>
        <Typography variant="h6">Card</Typography>
        <Typography variant="body2" color="text.secondary">
          系級:資管四乙<br />
          學號:411402417<br />
          姓名:陳建宇<br />
          專長:無<br />
          興趣:打羽球
        </Typography>
      </CardContent>
    </Card>
  );
}
