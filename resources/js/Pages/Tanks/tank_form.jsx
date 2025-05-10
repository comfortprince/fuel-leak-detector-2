import { Box, Typography, TextField} from '@mui/material';

export default function TankForm({
    data,
    errors,
    setData
}) {
    return <Box
        sx={{
            width:'50%'
        }}
    >
        <Typography 
            variant='subtitle1'
            sx={{
                fontWeight: '500'
            }}
        >
            Tank Details
        </Typography>
        <Box
            sx={{
                mt:'0.25rem',
                display:'flex',
                flexDirection:'column',
                rowGap:'0.5rem'
            }}
        >
            <Box>
                <TextField 
                    id="" 
                    size="small" 
                    label={ data.tank_identifier ? '' : 'e.g Tank-001' } 
                    variant="outlined"
                    value={data.tank_identifier}
                    onChange={(e) => { setData('tank_identifier', e.target.value) }}
                    error={errors.tank_identifier ? true : false}
                    helperText={errors.tank_identifier}
                />
            </Box>
            <Box>
                <TextField 
                    id="" 
                    size="small" 
                    label={ data.tank_location ? '' : 'Location' } 
                    variant="outlined"
                    value={data.tank_location}
                    onChange={(e) => { setData('tank_location', e.target.value) }}
                    error={errors.tank_location ? true : false}
                    helperText={errors.tank_location}
                />
            </Box>
        </Box>
    </Box>
}