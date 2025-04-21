import Auth from '../Layout/Auth'
import { Box, Typography, Paper } from '@mui/material'

export default function Show({
    fuelTank
}) {
    console.log(fuelTank)
    return (<>
        <Auth headerTitle={'Tanks Details'}>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                        <Typography>
                            Tank Identifier:
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {fuelTank.tank_identifier}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                        <Typography>
                            Location:
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {fuelTank.location}
                        </Typography>
                    </Box>
                    {fuelTank.sensors.map((sensor) => {
                        if(sensor.type === 'mq2'){
                            return (<Box key={sensor.id} sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                <Typography>
                                    MQ2 Identifier:
                                </Typography>
                                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                    {sensor.sensor_identifier}
                                </Typography>
                            </Box>)
                        }else{
                            return (<Box key={sensor.id}  sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                <Typography>
                                    BMP Identifier:
                                </Typography>
                                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                    {sensor.sensor_identifier}
                                </Typography>
                            </Box>)
                        }
                    })}
                </Box>

                <Box>
                    <Paper>
                        <Typography variant='h6'>
                            Policies
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
                            {fuelTank.alert_policies.map((policy) => {
                                return (<Box key={policy.id} elevation='2' >
                                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                        <Typography>
                                            Message:
                                        </Typography>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            {policy.alert_message}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                        <Typography>
                                            Alert Type:
                                        </Typography>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            {policy.alert_type}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                        <Typography>
                                            BMP Min:
                                        </Typography>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            {policy.bmp180_min}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                        <Typography>
                                            BMP Max:
                                        </Typography>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            {policy.bmp180_max}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                        <Typography>
                                            MQ2 Min:
                                        </Typography>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            {policy.mq2_min}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                                        <Typography>
                                            MQ2 Max:
                                        </Typography>
                                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                            {policy.mq2_max}
                                        </Typography>
                                    </Box>
                                </Box>)
                            })}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Auth>
    </>)
}