import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, CircularProgress, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Link } from '@inertiajs/react';

const AlertStatus = ({
  critical,
  warning,
  info
}) => {
  const [loading, setLoading] = useState(false);
  const alertData = {
    critical: critical,
    warning: warning,
    info: info
  };

  const totalAlerts = alertData.critical + alertData.warning + alertData.info;

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Alert Status
          </Typography>
          <Link href={'/alerts'}>
            <Button 
              size="small"
              sx={{ p: 0, display: 'inline-flex', justifyContent: 'end' }}
            ><ArrowForwardIcon /></Button>
          </Link>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="body1">Critical</Typography>
            </Box>
            <Chip 
              label={alertData.critical} 
              color="error" 
              size="small" 
              sx={{ minWidth: '40px' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="body1">Warning</Typography>
            </Box>
            <Chip 
              label={alertData.warning} 
              color="warning" 
              size="small"
              sx={{ minWidth: '40px' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="body1">Info</Typography>
            </Box>
            <Chip 
              label={alertData.info} 
              color="info" 
              size="small"
              sx={{ minWidth: '40px' }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            {totalAlerts} unresolved {totalAlerts === 1 ? 'alert' : 'alerts'} requiring attention
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertStatus;