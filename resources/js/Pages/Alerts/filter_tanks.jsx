import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { router } from '@inertiajs/react';

export default function FilterTanks({ fuelTanks }) {
  const url = new URL(window.location.href);
  const location = url.searchParams.get("location");

  let _fuelTanks = !location ? ['all', ...fuelTanks] : fuelTanks
  const [fuelTank, setFuelTank] = React.useState(_fuelTanks[0]);

  const handleChange = (event) => {
    setFuelTank(event.target.value);

    router.visit('/alerts', {
        method: 'get',
        data: { 
          fuelTank: event.target.value !== 'all' ? event.target.value : null,
          location: location ? location : null
        },
        preserveScroll: true,
        preserveState: true
    })
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">fuelTank</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fuelTank}
          label="fuelTank"
          onChange={handleChange}
          size='small'
        >
            {_fuelTanks.map((fuelTank) => (
                <MenuItem key={fuelTank} value={fuelTank}>{fuelTank}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
