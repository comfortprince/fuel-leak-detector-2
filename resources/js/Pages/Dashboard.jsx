import Auth from './Layout/Auth'
import TankStatusSummary from './tank_status_summary';
import AlertStatus from './alert_status';
import RecentActivity from './recent_activity';
import UserActions from './user_actions';
import TankList from './tank_list';
import AlertTrends from './alert_trends_xcharts';
import CriticalLocations from './critical_locations';

import { 
  tankStatusSummary, 
  alertStatus, 
  activitiesFunc, 
  getLocationData, formatAggregateData
} from '../Helpers/helpers';

import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { router } from '@inertiajs/react'

import { Button } from '@mui/material';

function Dashboard({
  auth,
  fuelTanks,
  alertTrendsData
}) {
  const tankStatusSummaryObj = tankStatusSummary(fuelTanks)
  const alertStatusObj = alertStatus(fuelTanks)
  const locationInfo = getLocationData(fuelTanks)
  const activities = activitiesFunc(fuelTanks)



  useEffect(() => {
    const interval = setInterval(() => {
      router.visit(route(route().current()), {
        replace: true, // keeps history clean
        preserveScroll: true
      })
    }, 10000) // 10 seconds

    return () => clearInterval(interval) // cleanup on unmount
  })

  return (
    <Auth headerTitle={'Dashboard'}>
        <Grid container spacing={2}>
          {/* <Grid size={3}>
            <TankStatusSummary 
              totalTanks={tankStatusSummaryObj.totalTanks}
              tanksWithAlerts={tankStatusSummaryObj.tanksWithAlerts}
              locations={tankStatusSummaryObj.locations}
            />
          </Grid>

          <Grid size={3}>
            <AlertStatus 
              critical={alertStatusObj.critical}
              warning={alertStatusObj.warning}
              info={alertStatusObj.info}
            />
          </Grid>
          
          <Grid size={3}>
            <RecentActivity activities={activities} />
          </Grid>
          <Grid size={3}>
            <UserActions
              auth={auth}
            />
          </Grid>
          <Grid size={12}>
            <TankList fuelTanks={fuelTanks}/>
          </Grid>
          <Grid size={12}>
            <CriticalLocations locationData={locationInfo}/>
          </Grid> */}
          <Grid size={12}>
            <AlertTrends alertTrendsData={alertTrendsData}/>
          </Grid>
        </Grid>
    </Auth>
  );
}

export default Dashboard;