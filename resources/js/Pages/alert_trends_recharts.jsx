import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, FormControl, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';

// Generate mock data for the alert trends
const generateMockAlertData = (days) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    data.push({
      date: format(date, 'MMM dd'),
      critical: Math.floor(Math.random() * 5),
      warning: Math.floor(Math.random() * 8) + 1,
      info: Math.floor(Math.random() * 12) + 2,
      readingCount: Math.floor(Math.random() * 500) + 100,
    });
  }
  
  return data;
};

const AlertTrends = () => {
  const [loading, setLoading] = useState(true);
  const [alertData, setAlertData] = useState([]);
  const [dateRange, setDateRange] = useState('7d');
  const [showReadings, setShowReadings] = useState(false);
  
  useEffect(() => {
    // In a real application, this would be an API call with the dateRange parameter
    const fetchAlertTrends = async () => {
      try {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
          // Generate appropriate data based on selected date range
          const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
          setAlertData(generateMockAlertData(days));
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error("Error fetching alert trends:", error);
        setLoading(false);
      }
    };
    
    fetchAlertTrends();
  }, [dateRange]);
  
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };
  
  const handleShowReadingsChange = (event) => {
    setShowReadings(event.target.checked);
  };
  
  // Calculate dynamic domain for YAxis based on data
  const getYAxisDomain = () => {
    if (!alertData || alertData.length === 0) return [0, 10];
    
    const maxAlertCount = Math.max(
      ...alertData.map(item => item.critical + item.warning + item.info)
    );
    
    return [0, maxAlertCount + 2]; // Add some padding at the top
  };
  
  // Calculate dynamic domain for secondary YAxis (readings count)
  const getReadingsYAxisDomain = () => {
    if (!alertData || alertData.length === 0) return [0, 100];
    
    const maxReadingCount = Math.max(...alertData.map(item => item.readingCount));
    const minReadingCount = Math.min(...alertData.map(item => item.readingCount));
    
    return [minReadingCount * 0.9, maxReadingCount * 1.1]; // Add some padding
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
                value={dateRange}
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
        
        <Box sx={{ flexGrow: 1, height: 'calc(100% - 50px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={alertData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                yAxisId="left"
                domain={getYAxisDomain()} 
                allowDecimals={false}
              />
              {showReadings && (
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={getReadingsYAxisDomain()}
                  allowDecimals={false}
                />
              )}
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="critical"
                name="Critical Alerts"
                stroke="#f44336"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="warning"
                name="Warning Alerts"
                stroke="#ff9800"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="info"
                name="Info Alerts"
                stroke="#2196f3"
                strokeWidth={2}
              />
              {showReadings && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="readingCount"
                  name="Sensor Readings"
                  stroke="#4caf50"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertTrends;