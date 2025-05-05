import React from 'react';
import { useRef, useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper
} from '@mui/material';
import { Droplet } from 'lucide-react';

import { Link } from '@inertiajs/react';

function Dashboard({
    headerTitle,
    children,
    pollingToggle
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
          <Sidebar/>
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

function Sidebar() {
    return <Paper 
        sx={{
            width: '100%',
            p: '1rem',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '0.5rem',
            backgroundColor: 'white',
            elevation: '1',
            height: '100%'
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
    </Paper>
}