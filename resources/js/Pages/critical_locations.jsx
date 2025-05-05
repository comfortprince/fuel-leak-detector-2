import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, ListItemIcon, CircularProgress, Divider, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorIcon from '@mui/icons-material/Error';

import ExportCriticalLocationsModal from './export_critical_locations';

const CriticalLocations = ({
  locationData
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [locationToDownload, setLocationToDownload] = useState('');

  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }
  
  // Get chip color based on risk level
  const getRiskChipColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" gutterBottom>
          Critical Locations
        </Typography>
        
        <List sx={{ width: '100%', flexGrow: 1, overflow: 'auto' }}>
          {locationData.map((location, index) => (
            <React.Fragment key={location.id}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <ListItem alignItems="flex-start" button sx={{ pl: 1 }}>
                <ListItemIcon>
                  <LocationOnIcon color={location.alertCount > 0 ? "error" : "disabled"} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{location.location}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {location.alertCount > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="error.main">
                              {location.alertCount}
                            </Typography>
                          </Box>
                        )}
                        <Chip 
                          label={location.riskLevel !== 'none' ? location.riskLevel : 'normal'} 
                          color={getRiskChipColor(location.riskLevel)} 
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Tanks:
                      </Typography>
                      {' '}
                      {location.tanks.join(', ')}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Box
                          onClick={() => { 
                            setLocationToDownload(location.location); 
                            handleOpen()
                          }}                          
                        >
                          <Typography
                            variant="caption"
                            color="primary"
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                          >
                            Download location info
                            <ArrowForwardIcon fontSize="inherit" sx={{ ml: 0.5 }} />
                          </Typography>
                        </Box>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
          {locationData.length === 0 && (
            <ListItem>
              <ListItemText primary="No locations found" />
            </ListItem>
          )}
        </List>
        
        <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningAmberIcon fontSize="small" sx={{ mr: 0.5 }} />
            {locationData.filter(loc => loc.alertCount > 0).length} locations with active alerts
          </Typography>
        </Box>
        <ExportCriticalLocationsModal open={open} handleClose={handleClose} location={locationToDownload} />
      </CardContent>
    </Card>
  );
};

export default CriticalLocations;