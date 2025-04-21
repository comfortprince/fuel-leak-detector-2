import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { Droplet } from 'lucide-react';

import { Link } from '@inertiajs/react'

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation */}
      <AppBar position="fixed" color="default" elevation={0} sx={{ bgcolor: 'white' }}>
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
              <a href="/auth/login">
                <Button variant="contained" color="primary">
                    Log In
                </Button>
              </a>
              <a href="/auth/register">
                <Button variant="contained" color="secondary">
                    Register
                </Button>
              </a>
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          pt: 15,
          pb: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h2" component="h1" fontWeight="bold">
              Fuel Leak Detection System
            </Typography>
            <Typography variant="h5" component="p" sx={{ maxWidth: '800px', opacity: 0.9 }}>
              Advanced IoT monitoring solution that helps you detect and prevent fuel leaks in real-time
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 6 }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center', sm: 'flex-start' }}
              spacing={2}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Droplet size={24} />
                <Typography variant="h6" fontWeight="bold">
                  FLDS
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 4 }}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
              >
                <Stack spacing={2}>
                  <Typography variant="subtitle1" color="white" fontWeight="bold">
                    Company
                  </Typography>
                  <Button color="inherit" sx={{ color: 'grey.400' }}>About</Button>
                  <Button color="inherit" sx={{ color: 'grey.400' }}>Contact</Button>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" color="white" fontWeight="bold">
                    Legal
                  </Typography>
                  <Button color="inherit" sx={{ color: 'grey.400' }}>Privacy</Button>
                  <Button color="inherit" sx={{ color: 'grey.400' }}>Terms</Button>
                </Stack>
              </Stack>
            </Stack>
            <Typography variant="body2" color="grey.500" textAlign={{ xs: 'center', sm: 'left' }}>
              © {new Date().getFullYear()} FLDS. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default App;