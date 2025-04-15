import React from 'react';
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
    children
}) {
  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
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

      {/* Hero Section */}
      <Box
        sx={{
          pb: 10,
          mt: 1,
          display: 'flex',
        }}
      >
        <Sidebar/>
        <Box 
            sx={{
                flexGrow: '1',
                p: '1rem',
                pt: 0
            }}
        >
          <Paper>
            <Typography 
              variant='h5' 
              sx={{
                p: 1,
                mb: 1
              }}
            >
              {headerTitle}
            </Typography>
          </Paper>
          <Paper sx={{ p: 1 }}>
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;

function Sidebar() {
    return <Paper 
        sx={{
            width: '15rem',
            p: '1rem',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '0.5rem',
            backgroundColor: 'white',
            elevation: '1'
        }}
    >
        <Link href={route('dashboard')}>
            <Button 
                variant={`${route().current('dashboard') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Dashboard
            </Button>
        </Link>
        <Link href={route('tanks.index')}>
            <Button 
                variant={`${route().current('tanks.index') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Tanks
            </Button>
        </Link>
        <Link href={route('alerts.index')}>
            <Button 
                variant={`${route().current('alerts.index') ? 'contained' : 'outlined'}`}
                sx={{
                    width: '100%'
                }}
            >
                Alerts
            </Button>
        </Link>
    </Paper>
}