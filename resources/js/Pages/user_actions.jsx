import React from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton, Divider, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { Link } from '@inertiajs/react';

const UserActions = ({
    auth
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            User Actions
          </Typography>
          <IconButton
            onClick={handleProfileClick}
            size="small"
            aria-controls={open ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'profile-button',
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Dark Mode</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Link href={route('logout')}>
                    Logout
                </Link>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
          <Link
            href={route('tanks.create')}
          >
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                fullWidth
            >
                Add Tank
            </Button>
          </Link>
          
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            fullWidth
            onClick={() => console.log("Configure Alert Policy clicked")}
          >
            Configure Alert Policy
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            fullWidth
            onClick={() => console.log("View Reports clicked")}
          >
            View Reports
          </Button>
        </Box>
        
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ width: 32, height: 32, mr: 1.5 }}
              alt="User Avatar"
              src="/api/placeholder/32/32"
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {auth.name}                
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <IconButton size="small" onClick={() => console.log("Settings clicked")}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserActions;