import React from 'react';
import Typography from '@mui/material/Typography';

export default function index(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © Chiuzan Alexandru '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
