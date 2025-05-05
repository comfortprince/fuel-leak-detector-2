// App.js or CardExample.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';

export default function PolicyInfo({ policy }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            Message:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {policy.alert_message}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            Policy Type:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {policy.alert_type}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            BMP Min:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {policy.bmp180_min}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            BMP Max:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {policy.bmp180_max}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            MQ2 Min:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {policy.mq2_min}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            MQ2 Max:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {policy.mq2_max}
          </Typography>
        </Box>
        
      </CardContent>
    </Card>
  );
}

