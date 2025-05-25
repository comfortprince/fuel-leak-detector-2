import Auth from '../Layout/Auth'
import TankForm from './tank_form';
import SensorForm from './sensor_form';
import AlertPolicies from './alert_policies';

import { Button, Box, Typography, TextField, Select, InputLabel, MenuItem, Chip } from '@mui/material';

import { useForm } from '@inertiajs/react';

function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tank_identifier: '',
        tank_location: '',
        mq2_identifier: '',
        bmp180_identifier: '',
        gps_latitude: '',
        gps_longitude: '',
        alert_policies: []
    })

    const handleSubmit = (e)=>{ 
        e.preventDefault();
        post(route('tanks.store')) 
    }

    return (
        <Auth headerTitle={'Regiter New Tank'} auth={auth}>
            <form action="#!" onSubmit={handleSubmit}>
                <Box
                    sx={{
                        display:'flex',
                        flexDirection:'column',
                        rowGap:'1rem'
                    }}
                >
                    <Box sx={{ display: 'flex' }}>
                        <TankForm data={data} errors={errors} setData={setData}/>
                        <SensorForm data={data} errors={errors} setData={setData}/>
                    </Box>
                    
                    <AlertPolicies data={data} errors={errors} setData={setData}/>

                    <Box>
                        <Button type="submit" variant='contained' disabled={processing}>
                            Register Tank
                        </Button>
                    </Box>
                </Box>
            </form>
        </Auth>
    );
}

export default Create;