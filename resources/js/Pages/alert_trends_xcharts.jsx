import React, { useState, useEffect, useMemo } from 'react';

import { router } from '@inertiajs/react';

import { Card, CardContent, Typography, Box, CircularProgress, FormControl, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { LineChart, BarChart } from '@mui/x-charts';
import { subDays, format } from 'date-fns';

const AlertTrends = ({
  alertTrendsData,
  filterState
}) => {
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState(alertTrendsData);
  const [daysRange, setDaysRange] = useState(filterState <= 6 ? '7d' : filterState <= 30 ? '30d' : '90d');
  const [showReadings, setShowReadings] = useState(false);
  
  const handleDateRangeChange = (event) => {
    const days = event.target.value;
    const daysRange = days === '7d' ? 6 : days === '30d' ? 29 : 89;
    setDaysRange(days);
    
    router.visit('/dashboard', {
      method: 'get',
      data: { 'daysRange': daysRange },
      preserveScroll: true
    });
  };
  
  const handleShowReadingsChange = (event) => {
    setShowReadings(event.target.checked);
  };
  
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }
  
  // Prepare data for MUI-X Charts format
  const xLabels = alertData.map(item => item.date);
  const criticalData = alertData.map(item => item.critical);
  const warningData = alertData.map(item => item.warning);
  const infoData = alertData.map(item => item.info);
  const readingsData = alertData.map(item => item.readingCount);
  
  // Calculate Y axis max values
  const maxAlertValue = Math.max(
    ...alertData.map(item => {
      return item.critical + item.warning + item.info + (showReadings ? item.readingCount : 0)
    })
  ) + 2;
  
  const maxReadingValue = Math.max(...readingsData) * 1.1;
  const minReadingValue = Math.min(...readingsData) * 0.9;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Alert Trends
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={showReadings}
                  onChange={handleShowReadingsChange}
                  size="small"
                />
              }
              label="Show Readings"
              labelPlacement="start"
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={daysRange}
                onChange={handleDateRangeChange}
                displayEmpty
              >
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1, height: 'calc(100% - 50px)', width: '100%' }}>
          <LineChart
            height={400}
            series={[
              {
                data: criticalData,
                label: 'Critical Alerts',
                color: '#f44336',
                showMark: false,
                valueFormatter: (value) => `${value} alerts`,
              },
              {
                data: warningData,
                label: 'Warning Alerts',
                color: '#ff9800',
                showMark: false,
                valueFormatter: (value) => `${value} alerts`,
              },
              {
                data: infoData,
                label: 'Info Alerts',
                color: '#2196f3',
                showMark: false,
                valueFormatter: (value) => `${value} alerts`,
              },
              ...(showReadings ? [{
                data: readingsData,
                label: 'Sensor Readings',
                color: '#4caf50',
                showMark: false,
                yAxisKey: 'readings',
                valueFormatter: (value) => `${value} readings`,
              }] : []),
            ]}
            xAxis={[
              {
                data: xLabels,
                scaleType: 'band',
                tickLabelStyle: {
                  angle: 0,
                  textAnchor: 'middle',
                },
              },
            ]}
            yAxis={[
              {
                id: 'alerts',
                scaleType: 'linear',
                min: 0,
                max: maxAlertValue,
                tickCount: 6,
                valueFormatter: (value) => value.toFixed(0),
              },
              ...(showReadings ? [{
                id: 'readings',
                scaleType: 'linear',
                min: minReadingValue,
                max: maxReadingValue,
                tickCount: 6,
                valueFormatter: (value) => value.toFixed(0),
              }] : []),
            ]}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 2,
              },
              '.MuiMarkElement-root': {
                stroke: 'white',
                scale: '1.2',
              },
              '.MuiChartsAxis-right .MuiChartsAxis-line, .MuiChartsAxis-right .MuiChartsAxis-tick': {
                stroke: '#4caf50'
              }
            }}
            tooltip={{ trigger: 'item' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertTrends;