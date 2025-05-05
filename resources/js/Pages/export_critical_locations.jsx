import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { FormControl, InputLabel, Select, TextField, MenuItem, FormHelperText } from '@mui/material';
import { useForm } from '@inertiajs/react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default function ExportCriticalLocationsModal({open, handleClose, location}) {
  const {data, setData, get, processing, errors} = useForm({
    startDate: '',
    endDate: ''
  })

  const onModalClose = () => {
    handleClose(); // Close the modal
    setData({
      startDate: '',
      endDate: ''
    });
  }

  const params = new URLSearchParams({
    startDate: data.startDate,
    endDate: data.endDate
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const a = document.createElement('a');
    a.href = `/excel/export/criticalLocations/${location}?${params.toString()}`;
    a.click();
  }
  
  return (
    <div>
      <Modal
        open={open}
        onClose={onModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Export Critical Locations Data
          </Typography>
            <Box 
                component={'form'}
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 2
                }}
            >
                
                <Box>
                  <Typography>
                    Start Date
                  </Typography>
                  <TextField 
                    id="startDate" 
                    variant="outlined"
                    size='small'
                    onChange={e => { setData('startDate', e.target.value) }}
                    sx={{
                        width: '100%'
                    }}
                    type='datetime-local'
                    required
                  />
                </Box>

                <Box>
                  <Typography>
                    End Date
                  </Typography>
                  <TextField 
                    id="endDate" 
                    variant="outlined"
                    size='small'
                    onChange={e => { setData('endDate', e.target.value) }}
                    sx={{
                        width: '100%'
                    }}
                    type='datetime-local'
                    required
                  />
                </Box>

                <Box>
                  <Button type='submit' variant='contained' disabled={processing}>
                    Download
                  </Button>
                </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}