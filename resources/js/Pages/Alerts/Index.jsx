import { Paper, TableBody, TableCell, Table, TableContainer, TableHead, TableRow, Chip, Button, Box } from '@mui/material';
import Auth from '../Layout/Auth'
import AlertPagination from './pagination';
import FilterLocation from './filter_location';
import FilterTanks from './filter_tanks';

import { Link } from '@inertiajs/react';

export default function Index({
    alertsData,
    locations,
    tanksPerLocation,
    auth
}) {
    const alerts = alertsData.data

    const alertColor = (alertType) => {
        let ret = ''
        switch (alertType) {
            case 'warning':
                ret = 'warning'
                break;
            case 'critical':
                ret = 'error'
                break;
            case 'info':
                ret = 'info'
                break;
        
            default:
                ret = 'primary'
                break;
        }
        return ret;
    }
    
    return (<>
        <Auth headerTitle={'Alerts'} auth={auth}>
            <Box 
                sx={{
                    mb: 1,
                    display: 'flex',
                    columnGap: 1
                }}
            >
                <FilterLocation locations={locations}/>
                <FilterTanks fuelTanks={tanksPerLocation}/>
            </Box>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Tank</TableCell>
                    <TableCell align="right">AlertType</TableCell>
                    <TableCell align="right">Message</TableCell>
                    <TableCell align="right">BMP Reading (Pa)</TableCell>
                    <TableCell align="right">MQ2 Reading (ppm)</TableCell>
                    <TableCell align="right">Resolved</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {alerts.map((alert) => (
                    <TableRow
                    key={alert.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">{alert.id}</TableCell>
                        <TableCell align="right">{alert.bmp180_reading.recorded_at}</TableCell>
                        <TableCell align="right">{alert.alert_policy.fuel_tank.tank_identifier}</TableCell>
                        <TableCell align="right">
                            <Chip color={alertColor(alert.alert_policy.alert_type)} label={alert.alert_policy.alert_type}/>
                        </TableCell>
                        <TableCell align="right">{alert.alert_policy.alert_message}</TableCell>
                        <TableCell align="right">{alert.bmp180_reading.value}</TableCell>
                        <TableCell align="right">{alert.mq2_reading.value}</TableCell>
                        <TableCell align="right">
                            {alert.resolved ? 
                                <Chip color='success' label='Yes'/> : 
                                <Chip color='error' label='No'/>}
                        </TableCell>
                        <TableCell align="right">
                            <Link href={`/alerts/resolve/${alert.id}`}>
                                <Button variant='contained' disabled={alert.resolved} size='small'>
                                    Resolve
                                </Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <Box>
                <AlertPagination alertsData={alertsData}/>
            </Box>
        </Auth>
    </>)
}