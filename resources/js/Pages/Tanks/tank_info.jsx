// App.js or CardExample.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';

export default function TankInfo({ fuelTank }) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            Tank Identifier:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {fuelTank.tank_identifier}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Typography variant="body1" >
            Location:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }} >
            {fuelTank.location}
          </Typography>
        </Box>

        {fuelTank.sensors.map((sensor) => {
          if(sensor.type === 'mq2'){
            return (
              <Box key={sensor.id} sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <Typography variant="body1" >
                  MQ2 Identifier:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }} >
                  {sensor.sensor_identifier}
                </Typography>
              </Box>)
          }else{
            return (
              <Box key={sensor.id} sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <Typography variant="body1" >
                  BMP Identifier:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }} >
                  {sensor.sensor_identifier}
                </Typography>
              </Box>)
          }
      })}
      </CardContent>
    </Card>
  );
}

