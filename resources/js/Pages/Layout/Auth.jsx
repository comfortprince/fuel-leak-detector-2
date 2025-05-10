import React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';

import { Droplet } from 'lucide-react';

import SettingsIcon from '@mui/icons-material/Settings';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';

import { Link, usePage } from '@inertiajs/react';

function Dashboard({
    headerTitle,
    children,
    pollingToggle,
    auth
}) {
  const appBarRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(0);

  const dashMainHeaderRef = useRef(null);
  const [dashMainHeaderHeight, setDashMainHeaderHeight] = useState(0);

  useEffect(() => {
    if (dashMainHeaderRef.current) {
      setDashMainHeaderHeight(dashMainHeaderRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
    }
  }, []);
  
  return (
    <Box
      sx={{
        height: '100vh'
      }}
    >
      {/* Navigation */}
      <AppBar 
        ref={appBarRef}
        position="static" 
        color="default" 
        elevation={1} 
        sx={{ bgcolor: 'white' }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Droplet size={24} color="#1976d2" />
              <Typography variant="h6" color="primary" fontWeight="bold">
                FLDS
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <a href="/auth/logout">
                <Button variant="contained" color="primary">
                    Logout
                </Button>
              </a>
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      {/* Dashboard Section */}
      <Box
        sx={{
          display: 'flex',
          height: `calc(100vh - ${appBarHeight}px)`,
        }}
      >
        <Box
          sx={{ 
            height: '100%',
            width: '16rem',
            p: 1
          }}
        >
          <Sidebar auth={auth}/>
        </Box>
        <Box 
          sx={{
            height: '100%',
            width: 'calc(100% - 16rem)',
          }}
        >
          <Box
            ref={dashMainHeaderRef}
            sx={{
              p: 1
            }}
          >
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography 
                variant='h5' 
                sx={{
                  p: 1,
                }}
              >
                {headerTitle}
              </Typography>
              <Box>
                {pollingToggle}
              </Box>
            </Paper>
          </Box>
          <Box 
            sx={{ 
              height: `calc(100% - ${dashMainHeaderHeight}px)`,
              overflow: 'auto',
              p: 1,
            }}>
            <Box>
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;

function Sidebar({auth}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { auth: Auth } = usePage().props;
  

    return <Paper 
        sx={{
            width: '100%',
            p: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            rowGap: '0.5rem',
            backgroundColor: 'white',
            elevation: '1',
            height: '100%'
        }}
    >
      <Box
        sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '0.5rem',
        }}
      >
        <Link href={'/dashboard'}>
            <Button 
                variant={`${route().current('dashboard') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Dashboard
            </Button>
        </Link>
        <Link href={'/tanks'}>
            <Button 
                variant={`${route().current('tanks.index') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Tanks
            </Button>
        </Link>
        <Link href={'/alerts'}>
            <Button 
                variant={`${route().current('alerts.index') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Alerts
            </Button>
        </Link>
        <Link href={route('users.index')}>
            <Button 
                variant={`${route().current('users.index') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Add Users
            </Button>
        </Link>
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ width: 32, height: 32, mr: 1.5 }}
            alt="User Avatar"
            src="#!"
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {Auth.name}                
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Auth.role === 'IT' ? 'IT' : Auth.role === 'field_operator' ? 'Field Operator' : 'Administrator'}
              {/* {auth.role} */}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <IconButton 
              size="small" 
              onClick={handleClick}>
              <SettingsIcon fontSize="small" />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Link href={'#!'}>
                  Profile
                </Link>
              </MenuItem>
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
        </Box>
      </Box>
    </Paper>
}