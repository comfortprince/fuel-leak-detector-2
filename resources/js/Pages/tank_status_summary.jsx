import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, CircularProgress, Button } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { router } from '@inertiajs/react';

const TankStatusSummary = ({
    totalTanks,
    tanksWithAlerts,
    locations
}) => {
  const [loading, setLoading] = useState(false);

  const locationArray = Object.keys(locations)
    .map(Number)
    .sort((a, b) => a - b)
    .map(key => locations[key]);
  const tankData = {
    totalTanks: totalTanks,
    tanksWithAlerts: tanksWithAlerts,
    locations: locationArray
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocationSelect = (location) => {
    let url = ''
    
    if(location != 'all'){
      url = `/dashboard?location=${location}`
    } else {
      url = `/dashboard`
    }

    router.visit(url,{
      method: 'get',
      preserveScroll: true
    })
    handleClose();
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Button
          size="small"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          aria-controls={open ? "location-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          Filter
        </Button>
        <Menu
          id="location-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleLocationSelect("all")}>All Locations</MenuItem>
          {tankData.locations.map((location) => (
            <MenuItem key={location} onClick={() => handleLocationSelect(location)}>
              {location}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Tank Status <br /> Summary
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">
              Total Tanks: <strong>{tankData.totalTanks}</strong>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningAmberIcon sx={{ mr: 1, color: tankData.tanksWithAlerts > 0 ? 'error.main' : 'text.secondary' }} />
            <Typography variant="body1">
              Tanks with Alerts: <strong>{tankData.tanksWithAlerts}</strong>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Locations:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tankData.locations.map((location) => (
                <Chip 
                  key={location} 
                  label={location} 
                  size="small" 
                  onClick={() => handleLocationSelect(location)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TankStatusSummary;