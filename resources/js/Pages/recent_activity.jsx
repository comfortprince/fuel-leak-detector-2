import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Avatar, Divider } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SensorsIcon from '@mui/icons-material/Sensors';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({
  activities
}) => {
  const [loading, setLoading] = useState(false);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'alert':
        return <NotificationsIcon sx={{ color: 'warning.main' }} />;
      case 'reading':
        return <SensorsIcon sx={{ color: 'info.main' }} />;
      default:
        return <TimelineIcon sx={{ color: 'text.secondary' }} />;
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
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Recent Activity
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <Box sx={{ display: 'flex', py: 1 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'action.hover' }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
                <Box>
                  <Typography variant="body2">
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;