export function tankStatusSummary(fuelTanks) {
    // Initialize counters and collections
    let tanksWithAlerts = 0;
    const locationsSet = new Set();
    
    // Process each fuel tank
    fuelTanks.forEach(tank => {
        // Add location to unique locations set
        if (tank.location) {
            locationsSet.add(tank.location);
        }
        
        // Check if this tank has any active alerts
        const hasActiveAlerts = tank.alert_policies?.some(policy => 
            policy.alerts?.some(alert => alert.resolved === 0)
        );
        
        if (hasActiveAlerts) {
            tanksWithAlerts++;
        }
    });
    
    // Convert Set to Array for locations
    const locations = Array.from(locationsSet);
    
    return {
        totalTanks: fuelTanks.length,
        tanksWithAlerts: tanksWithAlerts,
        locations: locations
    };
}

export function alertStatus(fuelTanks) {
    const result = {
        critical: 0,
        warning: 0,
        info: 0
    };

    fuelTanks.forEach(tank => {
        tank.alert_policies.forEach(policy => {
            const { alert_type, alerts } = policy;

            alerts.forEach(alert => {
                if (!alert.resolved) {
                    if (alert_type === 'critical') {
                        result.critical++;
                    } else if (alert_type === 'warning') {
                        result.warning++;
                    } else if (alert_type === 'info') {
                        result.info++;
                    }
                }
            });
        });
    });

    return result;
}

// sdgdfsfdfssssssssssf

/**
 * Returns the three latest alerts with unique tanks in the specified format
 * @param {Array} fuelTanks - Array of fuel tank objects
 * @return {Array} Latest three alerts from unique tanks
 */
export function activitiesFunc(fuelTanks) {
    // Create an array to hold all alerts with tank information
    const allAlerts = [];
    
    // Process each fuel tank
    fuelTanks.forEach(tank => {
      // Process each alert policy for this tank
      if (tank.alert_policies && tank.alert_policies.length > 0) {
        tank.alert_policies.forEach(policy => {
          // Process each alert for this policy
          if (policy.alerts && policy.alerts.length > 0) {
            policy.alerts.forEach(alert => {
              // Format the description string according to the formula
              const description = `${policy.alert_type.charAt(0).toUpperCase() + policy.alert_type.slice(1)} alert triggered for ${tank.tank_identifier}`;
              
              allAlerts.push({
                id: alert.id,
                type: 'alert',
                description: description,
                tankId: tank.tank_identifier,
                timestamp: new Date(alert.triggered_at)
              });
            });
          }
        });
      }
    });
    
    // Sort all alerts by triggered_at date (newest first)
    allAlerts.sort((a, b) => b.timestamp - a.timestamp);
    
    // Filter to get unique tanks (keep only the latest alert for each tank)
    const uniqueTankIds = new Set();
    const uniqueTankAlerts = [];
    
    allAlerts.forEach(alert => {
      if (!uniqueTankIds.has(alert.tankId)) {
        uniqueTankIds.add(alert.tankId);
        uniqueTankAlerts.push(alert);
      }
    });
    
    // Return only the three latest alerts from unique tanks
    return uniqueTankAlerts.slice(0, 3);
}

  
/**
 * Returns location-specific data including alert counts and tanks
 * @param {Array} fuelTanks - Array of fuel tank objects
 * @return {Array} Location data with alert counts and risk levels
 */
export function getLocationData(fuelTanks) {
    // Create a map to gather data by location
    const locationMap = new Map();
    
    // Process each fuel tank to gather location data
    fuelTanks.forEach(tank => {
      const location = tank.location || 'Unknown';
      
      // Initialize location data if it doesn't exist
      if (!locationMap.has(location)) {
        locationMap.set(location, {
          id: locationMap.size + 1,
          location: location,
          alertCount: 0,
          tanks: [],
          alertTypes: new Set() // To help determine risk level
        });
      }
      
      const locationData = locationMap.get(location);
      
      // Add tank identifier to the location's tanks array
      locationData.tanks.push(tank.tank_identifier);
      
      // Count alerts for this tank and gather alert types
      if (tank.alert_policies && tank.alert_policies.length > 0) {
        tank.alert_policies.forEach(policy => {
          if (policy.alerts && policy.alerts.length > 0) {
            // Count unresolved alerts
            const unresolvedAlerts = policy.alerts.filter(alert => alert.resolved === 0);
            locationData.alertCount += unresolvedAlerts.length;
            
            // Track alert types for risk level calculation
            if (unresolvedAlerts.length > 0) {
              locationData.alertTypes.add(policy.alert_type);
            }
          }
        });
      }
    });
    
    // Convert map to array and determine risk levels
    const locationsArray = Array.from(locationMap.values()).map(location => {
      // Determine risk level based on alerts and their types
      let riskLevel = 'none';
      
      if (location.alertCount > 0) {
        if (location.alertTypes.has('critical')) {
          riskLevel = 'high';
        } else if (location.alertTypes.has('warning')) {
          riskLevel = 'medium';
        } else {
          riskLevel = 'low';
        }
      }
      
      // Remove the temporary alertTypes property
      const { alertTypes, ...cleanedLocation } = location;
      
      return {
        ...cleanedLocation,
        riskLevel
      };
    });
    
    // Since your sample data might not have enough locations to match
    // the expected output format, we'll add mock data if needed
    // const mockLocations = [
    //   { 
    //     id: locationsArray.length + 1, 
    //     location: 'Distribution Center', 
    //     alertCount: Math.floor(Math.random() * 8) + 1, 
    //     riskLevel: 'medium',
    //     tanks: ['TK-002', 'TK-006'] 
    //   },
    //   { 
    //     id: locationsArray.length + 2, 
    //     location: 'Storage Facility', 
    //     alertCount: Math.floor(Math.random() * 5) + 1, 
    //     riskLevel: 'low',
    //     tanks: ['TK-003', 'TK-009', 'TK-012']
    //   },
    //   { 
    //     id: locationsArray.length + 3, 
    //     location: 'Main Office', 
    //     alertCount: Math.floor(Math.random() * 3), 
    //     riskLevel: 'none',
    //     tanks: ['TK-004', 'TK-007'] 
    //   }
    // ];
    
    // Add mock locations only if we don't have enough real data
    // to reach the expected format length
    // while (locationsArray.length < 4 && mockLocations.length > 0) {
    //   locationsArray.push(mockLocations.shift());
    // }
    
    return locationsArray;
  }

 /**
  * Formats sensor and alert data into daily aggregated records
  * @param {Array} fuelTanks - Array of fuel tank objects
  * @param {Number} days - Number of days to look back (7, 30, or 90)
  * @return {Array} Array of daily aggregated data
  */
export const formatAggregateData = (fuelTanks, days) => {
   // Validate days parameter
   if (![7, 30, 90].includes(days)) {
     console.warn('Invalid days parameter. Using default of 7 days.');
     days = 7;
   }
   
   // Calculate the start date based on the days parameter
   const today = new Date();
   const startDate = new Date();
   startDate.setDate(today.getDate() - days);
   startDate.setHours(0, 0, 0, 0);

   console.log(today);
   
   
   // Create a map to hold data for each day
   const dailyDataMap = new Map();
   
   // Initialize the map with empty data for each day in the range
   for (let i = 0; i < days; i++) {
     const date = new Date(today);
     date.setDate(today.getDate() - i);
     date.setHours(0, 0, 0, 0);

     const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

     dailyDataMap.set(dateString, {
       date: dateString,
       critical: 0,
       warning: 0,
       info: 0,
       readingCount: 0
     });
   }

   console.log(dailyDataMap);
   
   // Process each fuel tank
   fuelTanks.forEach(tank => {
     // Process sensor readings
     if (tank.sensors && tank.sensors.length > 0) {
       tank.sensors.forEach(sensor => {
         if (sensor.sensor_readings && sensor.sensor_readings.length > 0) {
           sensor.sensor_readings.forEach(reading => {
             const readingDate = new Date(reading.recorded_at);
             
             // Skip readings before the start date
             if (readingDate < startDate) {
               return;
             }
             
             const dateString = readingDate.toISOString().split('T')[0];
             
             // Only count if the date is in our map (within the specified range)
             if (dailyDataMap.has(dateString)) {
               dailyDataMap.get(dateString).readingCount++;
             }
           });
         }
       });
     }
     
     // Process alerts
     if (tank.alert_policies && tank.alert_policies.length > 0) {
       tank.alert_policies.forEach(policy => {
         if (policy.alerts && policy.alerts.length > 0) {
           policy.alerts.forEach(alert => {
             const alertDate = new Date(alert.triggered_at);
             
             // Skip alerts before the start date
             if (alertDate < startDate) {
               return;
             }
             
             const dateString = alertDate.toISOString().split('T')[0];
             
             // Only count if the date is in our map (within the specified range)
             if (dailyDataMap.has(dateString)) {
               // Increment the appropriate alert counter based on the alert type
               const alertType = policy.alert_type?.toLowerCase() || 'info';
               
               if (alertType === 'critical') {
                 dailyDataMap.get(dateString).critical++;
               } else if (alertType === 'warning') {
                 dailyDataMap.get(dateString).warning++;
               } else {
                 dailyDataMap.get(dateString).info++;
               }
             }
           });
         }
       });
     }
   });
   
   // Convert the map to an array and sort by date (oldest to newest)
   const result = Array.from(dailyDataMap.values())
     .filter(dayData => dayData.readingCount > 0 || dayData.critical > 0 || dayData.warning > 0 || dayData.info > 0)
     .sort((a, b) => new Date(a.date) - new Date(b.date));
   
   return result;
 };