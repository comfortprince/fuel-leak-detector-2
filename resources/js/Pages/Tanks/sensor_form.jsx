import { Box, Typography, TextField } from '@mui/material';

function SensorForm({
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
            Sensor Details
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
                    label="" 
                    variant="outlined" 
                    defaultValue={data.mq2_identifier ? data.mq2_identifier : 'MQ2 pressure sensor'} 
                    disabled
                />
            </Box>
            <Box>
                <TextField 
                    id="" 
                    size="small" 
                    label="" 
                    variant="outlined" 
                    defaultValue={data.bmp180_identifier ? data.bmp180_identifier :  'BMP180 gas sensor'} 
                    disabled
                />
            </Box>
        </Box>
    </Box>
}

export default SensorForm;