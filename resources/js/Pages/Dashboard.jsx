import Auth from './Layout/Auth'
import TankStatusSummary from './tank_status_summary';
import AlertStatus from './alert_status';
import RecentActivity from './recent_activity';
import UserActions from './user_actions';
import AlertTrends from './alert_trends_xcharts';
import CriticalLocations from './critical_locations';

import { usePoll } from '@inertiajs/react'

import { Grid, Button, Box } from '@mui/material';
import { useState } from 'react';

function Dashboard({
  auth,
  tankStatusSummary,
  activities,
  alertCounts,
  locationStats,
  alertTrendsData
}) {
  return (
    <Auth 
      headerTitle={'Dashboard'}
      pollingToggle={<PollingTrigger/>}
    >
        <Grid container spacing={2}>
          <Grid size={3}>
            <TankStatusSummary 
              totalTanks={tankStatusSummary.totalTanks}
              tanksWithAlerts={tankStatusSummary.tanksWithAlerts}
              locations={tankStatusSummary.locations}
            />
          </Grid>

          <Grid size={3}>
            <AlertStatus 
              critical={alertCounts.critical}
              warning={alertCounts.warning}
              info={alertCounts.info}
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
            <CriticalLocations locationData={locationStats}/>
          </Grid>
          <Grid size={12}>
            <AlertTrends 
              alertTrendsData={alertTrendsData.data}
              filterState={alertTrendsData.filterState}
            />
          </Grid>
        </Grid>
    </Auth>
  );
}

export default Dashboard;

const PollingTrigger = () => {
  const [pollingState, setPollingState] = useState(false);
  const { start, stop } = usePoll(2000, {}, {
      autoStart: false,
  })

  if(pollingState === true){
    start();
  } else {
    stop();
  }

  return (
      <Box sx={{ mr: 1, display: 'inline-flex', columnGap: 1 }}>
          <Button 
            size='small' 
            onClick={() => { setPollingState(true) }}
            variant={pollingState === true ? 'contained' : 'outlined'}
            color='secondary'
          >Live Data</Button>
          <Button 
            size='small' 
            onClick={() => { setPollingState(false) }}
            variant={pollingState === false ? 'contained' : 'outlined'}
            color='secondary'
          >No Live Data</Button>
      </Box>
  )
}