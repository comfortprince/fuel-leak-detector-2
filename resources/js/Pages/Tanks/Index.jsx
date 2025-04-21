import Auth from '../Layout/Auth'
import { useForm } from '@inertiajs/react';

import { 
  Button, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Link } from '@inertiajs/react'

function Index({
  fuelTanks
}) {
  const { delete: destroy } = useForm({})

  const handleTankDelete = (tankId) => {
    destroy(`/tanks/${tankId}`);
  }
  
  return (
    <Auth headerTitle={'Tanks'}>
      <Box>
        <Link href={'/tanks/create'}>
          <Button variant='contained'>
            Regiter Tank
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Tank Identifier</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">MQ2 Sensor Identifier</TableCell>
                <TableCell align="right">BMP_180 Sensor Identifier</TableCell>
                <TableCell align="right"># of Alert Policies</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fuelTanks.map((fuelTank) => (
                <TableRow
                  key={fuelTank.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {fuelTank.tank_identifier}
                  </TableCell>
                  <TableCell align="right">{fuelTank.location}</TableCell>
                  <TableCell align="right">
                    {fuelTank.sensors.filter((sensor)=>(sensor.type === "mq2"))[0].sensor_identifier}
                  </TableCell>
                  <TableCell align="right">
                    {fuelTank.sensors.filter((sensor)=>(sensor.type === "bmp180"))[0].sensor_identifier}
                  </TableCell>
                  <TableCell align="right">
                    {fuelTank.alert_policies.length}
                  </TableCell>
                  <TableCell align="right" sx={{ display: 'inline-flex', columnGap: 1 }}>
                    <Button 
                      variant='contained' 
                      color='error'
                      size='small'
                      onClick={()=>{ handleTankDelete(fuelTank.id) }}
                    >
                      Delete
                    </Button>
                    <Link href={`/tanks/${fuelTank.id}`}>
                      <Button variant='contained' size='small'>
                        Show
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Auth>
  );
}

export default Index;