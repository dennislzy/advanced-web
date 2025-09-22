'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MediaCard = () => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140, backgroundColor: '#1976d2' }}
                title="林子淵的個人資料"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    林子淵
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    學號：411402120
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    來自輔仁大學
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">聯絡我</Button>
                <Button size="small">了解更多</Button>
            </CardActions>
        </Card>
    );
};

export default MediaCard;