import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { router } from '@inertiajs/react';

export default function FilterLocation({ locations }) {
  const [location, setLocation] = React.useState('all');

  const handleChange = (event) => {
    setLocation(event.target.value);

    router.visit('/alerts', {
        method: 'get',
        data: { location: event.target.value !== 'all' ? event.target.value : null },
        preserveScroll: true,
        preserveState: true
    })
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">location</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={location}
          label="Location"
          onChange={handleChange}
          size='small'
        >
            <MenuItem key={"none"} value={"all"}>All</MenuItem>
            {locations.map((location) => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
