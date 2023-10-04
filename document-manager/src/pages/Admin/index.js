import React from 'react';
import Table from '../../components/../components/Table/admin';
import Toolbar from '@mui/material/Toolbar';


export default function index() {
    return (
        <div style={{ width: '85%' }}>
            <Toolbar />
            <Table/>
        </div>
    );
}
