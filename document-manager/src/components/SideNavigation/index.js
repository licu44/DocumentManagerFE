import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';

import Header from '../Header/index.js';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CollectionsIcon from '@mui/icons-material/Collections';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import NavOption from '../NavOption';

const drawerWidth = 240;

function SideNavigation(props) {
    const { window } = props;
    const [ mobileOpen, setMobileOpen ] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const container = window !== undefined ? () => {
        return window().document.body;
    } : undefined;

    return (
        <>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        'display': { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <NavOption/>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        'display': { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <NavOption/>
                </Drawer>
            </Box>
        </>
    );
}

export default SideNavigation;
