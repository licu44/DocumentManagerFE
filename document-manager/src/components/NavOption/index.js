import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CollectionsIcon from '@mui/icons-material/Collections';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const SideNavigation = () => {
    const [ isOpen, setIsOpen ] = React.useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen);
    };

    const options = [
        { text: 'Project Status', icon: <HomeWorkIcon />, path: '/' },
        { text: 'Documents', icon: <CollectionsIcon />, path: '/documents' },
        { text: 'Project Gallery', icon: <DocumentScannerIcon />, path: '/gallery' },
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
        { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Toolbar />
            <Drawer
                variant="permanent"
                sx={{
                    'width': drawerWidth,
                    'flexShrink': 0,
                    '& .MuiDrawer-paper': { width: drawerWidth },
                }}
                open={isOpen}
                onClose={handleDrawerToggle}
            >
                <Toolbar />
                <Divider />
                <List>
                    {options.map((option) => {
                        return <ListItem key={option.text} disablePadding>
                            <ListItemButton component={RouterLink} to={option.path}>
                                <ListItemIcon>{option.icon}</ListItemIcon>
                                <ListItemText primary={option.text} />
                            </ListItemButton>
                        </ListItem>;
                    }
                    )}
                </List>
            </Drawer>
        </Box>
    );
};

export default SideNavigation;
