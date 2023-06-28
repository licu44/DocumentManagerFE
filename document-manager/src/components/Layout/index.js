import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideNavigation from '../SideNavigation';
import Box from '@mui/material/Box';
import Header from '../Header/index.js';

const Layout = () => {
    const [ mobileOpen, setMobileOpen ] = useState(false);


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const location = useLocation();
    const getPageTitle = (pathname) => {
        if (pathname === '/') {
            return 'Status';
        } else if (pathname === '/admin') {
            return 'Admin';
        } else if (pathname === '/documents') {
            return 'Documents';
        } else if (pathname === '/gallery') {
            return 'Gallery';
        }
        return 'Page Not Found';
    };
    const pageTitle = getPageTitle(location.pathname);

    return (
        <Box sx={{ display: 'flex' }}>
            <Header drawerWidth={240} title={pageTitle} handleDrawerToggle={handleDrawerToggle} />
            <SideNavigation mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            <Outlet />

        </Box>
    );
};

export default Layout;
