import React from 'react';
import Table from '../../components/Table';
import Toolbar from '@mui/material/Toolbar';

export default function index() {
    return (
        <div style={{ width: '100%' }}>
            <Toolbar />
            <Table />
            <Table />
        </div>
    );
}
