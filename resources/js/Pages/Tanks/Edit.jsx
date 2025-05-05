import Auth from '../Layout/Auth'
import TankForm from './tank_form';
import SensorForm from './sensor_form';
import AlertPoliciesEdit from './alert_policies_edit';

import { Button, Box, Typography, TextField, Select, InputLabel, MenuItem, Chip } from '@mui/material';

import { useForm } from '@inertiajs/react';

export default function Edit({ fuelTank }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        id: fuelTank.id,
        tank_identifier: fuelTank.tank_identifier,
        tank_location: fuelTank.location,
        mq2_identifier: fuelTank.sensors.find(sensor => sensor.type === "mq2").sensor_identifier,
        bmp180_identifier: fuelTank.sensors.find(sensor => sensor.type === "bmp180").sensor_identifier,
        alert_policies: fuelTank.alert_policies
    })

    const handleSubmit = (e)=>{ 
        e.preventDefault();
        patch(route('tanks.update', fuelTank.id)) 
    }

    return (
        <Auth headerTitle={`Edit details for ${fuelTank.tank_identifier}`}>
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
                    
                    <AlertPoliciesEdit data={data} errors={errors} setData={setData}/>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="submit" variant='contained' disabled={processing}>
                            Save
                        </Button>
                        <Button type="button" variant='outlined' disabled={processing}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </form>
        </Auth>
    );
}