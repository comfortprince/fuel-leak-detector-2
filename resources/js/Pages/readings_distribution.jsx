import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

// Mock data for sensor readings distribution
const generateMockData = () => {
  // Create distribution data for both sensor types
  const mq2Distribution = [
    { range: '0-50', count: Math.floor(Math.random() * 20) + 5 },
    { range: '51-100', count: Math.floor(Math.random() * 30) + 15 },
    { range: '101-150', count: Math.floor(Math.random() * 40) + 20 },
    { range: '151-200', count: Math.floor(Math.random() * 30) + 10 },
    { range: '201-250', count: Math.floor(Math.random() * 15) + 5 },
    { range: '>250', count: Math.floor(Math.random() * 10) + 1 }
  ];
  
  const bmp180Distribution = [
    { range: '900-950', count: Math.floor(Math.random() * 10) + 2 },
    { range: '951-1000', count: Math.floor(Math.random() * 25) + 10 },
    { range: '1001-1050', count: Math.floor(Math.random() * 40) + 25 },
    { range: '1051-1100', count: Math.floor(Math.random() * 20) + 15 },
    { range: '1101-1150', count: Math.floor(Math.random() * 10) + 5 },
    { range: '>1150', count: Math.floor(Math.random() * 5) + 1 }
  ];
  
  return {
    mq2: mq2Distribution,
    bmp180: bmp180Distribution,
    // These thresholds would come from your alert policies
    thresholds: {
      mq2_min: 50,
      mq2_max: 200,
      bmp180_min: 950,
      bmp180_max: 1100
    }
  };
};

const ReadingsDistribution = () => {
  const [loading, setLoading] = useState(true);
  const [distributionData, setDistributionData] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [sensorType, setSensorType] = useState('mq2');
  
  useEffect(() => {
    // In a real application, this would be an API call with the timeRange parameter
    const fetchDistributionData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
          setDistributionData(generateMockData());
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error("Error fetching distribution data:", error);
        setLoading(false);
      }
    };
    
    fetchDistributionData();
  }, [timeRange]);
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  const handleSensorTypeChange = (event) => {
    setSensorType(event.target.value);
  };
  
  // Get threshold lines based on sensor type
  const getThresholdLines = () => {
    if (!distributionData) return [];
    
    if (sensorType === 'mq2') {
      return [
        { value: distributionData.thresholds.mq2_min, label: 'Min', color: '#ff9800' },
        { value: distributionData.thresholds.mq2_max, label: 'Max', color: '#f44336' }
      ];
    } else {
      return [
        { value: distributionData.thresholds.bmp180_min, label: 'Min', color: '#ff9800' },
        { value: distributionData.thresholds.bmp180_max, label: 'Max', color: '#f44336' }
      ];
    }
  };
  
  // Get appropriate chart data based on selected sensor type
  const getChartData = () => {
    if (!distributionData) return [];
    return sensorType === 'mq2' ? distributionData.mq2 : distributionData.bmp180;
  };
  
  // Get appropriate y-axis domain based on sensor type
  const getYAxisDomain = () => {
    const data = getChartData();
    if (!data || data.length === 0) return [0, 10];
    
    const maxCount = Math.max(...data.map(item => item.count));
    return [0, maxCount + 5]; // Add some padding at the top
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
            Readings Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sensorType}
                onChange={handleSensorTypeChange}
                displayEmpty
              >
                <MenuItem value="mq2">MQ2 (Gas)</MenuItem>
                <MenuItem value="bmp180">BMP180 (Pressure)</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                displayEmpty
              >
                <MenuItem value="24h">Last 24h</MenuItem>
                <MenuItem value="7d">Last 7d</MenuItem>
                <MenuItem value="30d">Last 30d</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1, height: 'calc(100% - 50px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                label={{ 
                  value: sensorType === 'mq2' ? 'Gas Level Range' : 'Pressure Range (hPa)', 
                  position: 'insideBottom', 
                  offset: -5 
                }} 
              />
              <YAxis 
                domain={getYAxisDomain()}
                label={{ 
                  value: 'Number of Readings', 
                  angle: -90, 
                  position: 'insideLeft' 
                }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} readings`, 'Count']}
                labelFormatter={(label) => `${sensorType === 'mq2' ? 'Gas Level' : 'Pressure'} Range: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="count" 
                name={sensorType === 'mq2' ? 'Gas Readings' : 'Pressure Readings'} 
                fill={sensorType === 'mq2' ? '#8884d8' : '#82ca9d'} 
              />
              {getThresholdLines().map((threshold, index) => (
                <ReferenceLine 
                  key={index}
                  x={threshold.value} 
                  stroke={threshold.color}
                  label={{ value: threshold.label, position: 'top', fill: threshold.color }}
                  strokeDasharray="3 3"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReadingsDistribution;