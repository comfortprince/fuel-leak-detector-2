import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDistanceToNow } from 'date-fns';

const TankList = ({
  fuelTanks
}) => {
  const [tanks, setTanks] = useState(formatTanks(fuelTanks))
  const [loading, setLoading] = useState(false);
  const [filteredTanks, setFilteredTanks] = useState(tanks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('identifier');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const filtered = tanks.filter(tank => 
      tank.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTanks(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, tanks]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    // Sort the tanks
    const sortedTanks = [...filteredTanks].sort((a, b) => {
      if (property === 'lastReading') {
        // Special handling for date comparison
        const dateA = a.lastMQ2Reading > a.lastBMP180Reading ? a.lastMQ2Reading : a.lastBMP180Reading;
        const dateB = b.lastMQ2Reading > b.lastBMP180Reading ? b.lastMQ2Reading : b.lastBMP180Reading;
        return isAsc ? dateA - dateB : dateB - dateA;
      }
      
      // Handle string comparison
      if (a[property] < b[property]) return isAsc ? -1 : 1;
      if (a[property] > b[property]) return isAsc ? 1 : -1;
      return 0;
    });
    
    setFilteredTanks(sortedTanks);
  };

  const getMostRecentReading = (tank) => {
    return tank.lastMQ2Reading > tank.lastBMP180Reading ? tank.lastMQ2Reading : tank.lastBMP180Reading;
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
            Tank List
          </Typography>
          <TextField
            size="small"
            placeholder="Search tanks..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '250px' }}
          />
        </Box>
        
        <TableContainer component={Paper} sx={{ flexGrow: 1, maxHeight: 'calc(100% - 100px)' }}>
          <Table stickyHeader aria-label="tank list table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'identifier'}
                    direction={orderBy === 'identifier' ? order : 'asc'}
                    onClick={() => handleRequestSort('identifier')}
                  >
                    Tank ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'location'}
                    direction={orderBy === 'location' ? order : 'asc'}
                    onClick={() => handleRequestSort('location')}
                  >
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Sensors</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'lastReading'}
                    direction={orderBy === 'lastReading' ? order : 'asc'}
                    onClick={() => handleRequestSort('lastReading')}
                  >
                    Latest Reading
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTanks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tank) => (
                  <TableRow key={tank.id} hover>
                    <TableCell component="th" scope="row">
                      {tank.identifier}
                    </TableCell>
                    <TableCell>{tank.location}</TableCell>
                    <TableCell align="center">{tank.sensorCount}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(getMostRecentReading(tank), { addSuffix: true })}
                    </TableCell>
                    <TableCell align="center">
                      {tank.hasActiveAlerts ? (
                        <Chip 
                          icon={<ErrorIcon />} 
                          label="Alert" 
                          color="error" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Normal" 
                          color="success" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => console.log(`View tank ${tank.id}`)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => console.log(`Edit tank ${tank.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredTanks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No tanks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTanks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default TankList;


/**
 * Formats tank data with latest sensor readings and alert status
 * @param {Array} tanks - Array of fuel tank objects
 * @return {Array} Formatted tank objects
 */
const formatTanks = (tanks) => {
  return tanks.map(tank => {
    // Initialize variables for sensor readings
    let lastMQ2Reading = null;
    let lastBMP180Reading = null;
    let sensorCount = tank.sensors ? tank.sensors.length : 0;
    
    // Find latest MQ2 and BMP180 readings if sensors exist
    if (tank.sensors && tank.sensors.length > 0) {
      // Find MQ2 sensor and its latest reading
      const mq2Sensor = tank.sensors.find(sensor => sensor.type === 'mq2');
      if (mq2Sensor && mq2Sensor.sensor_readings && mq2Sensor.sensor_readings.length > 0) {
        // Sort readings by recorded_at (newest first)
        const sortedMQ2Readings = [...mq2Sensor.sensor_readings].sort((a, b) => 
          new Date(b.recorded_at) - new Date(a.recorded_at)
        );
        lastMQ2Reading = new Date(sortedMQ2Readings[0].recorded_at);
      }
      
      // Find BMP180 sensor and its latest reading
      const bmp180Sensor = tank.sensors.find(sensor => sensor.type === 'bmp180');
      if (bmp180Sensor && bmp180Sensor.sensor_readings && bmp180Sensor.sensor_readings.length > 0) {
        // Sort readings by recorded_at (newest first)
        const sortedBMP180Readings = [...bmp180Sensor.sensor_readings].sort((a, b) => 
          new Date(b.recorded_at) - new Date(a.recorded_at)
        );
        lastBMP180Reading = new Date(sortedBMP180Readings[0].recorded_at);
      }
    }
    
    // Check if tank has any active (unresolved) alerts
    let hasActiveAlerts = false;
    if (tank.alert_policies && tank.alert_policies.length > 0) {
      // Look through all alert policies
      for (const policy of tank.alert_policies) {
        // Check if this policy has any unresolved alerts
        if (policy.alerts && policy.alerts.some(alert => alert.resolved === 0)) {
          hasActiveAlerts = true;
          break; // No need to check further once we find an active alert
        }
      }
    }
    
    // If we couldn't find actual readings, use the placeholders
    if (lastMQ2Reading === null) {
      lastMQ2Reading = new Date(Date.now() - 25 * 60000);
    }
    
    if (lastBMP180Reading === null) {
      lastBMP180Reading = new Date(Date.now() - 20 * 60000);
    }
    
    return {
      id: tank.id,
      identifier: tank.tank_identifier,
      location: tank.location,
      sensorCount: sensorCount,
      lastMQ2Reading: lastMQ2Reading,
      lastBMP180Reading: lastBMP180Reading,
      hasActiveAlerts: hasActiveAlerts
    };
  });
};