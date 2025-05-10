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

export default function CreateUserModal({open, handleClose}) {
  const {data, setData, post, processing, errors} = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: ''
  })

  const onModalClose = () => {
    handleClose(); // Close the modal
    setData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: ''
    });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('users.store'), {
      onSuccess: onModalClose,
    });
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
            Create User
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
                <TextField 
                    id="name" 
                    label="name" 
                    variant="outlined"
                    size='small'
                    onChange={e => { setData('name', e.target.value) }}
                    value={data.name}
                    sx={{
                        width: '100%'
                    }} 
                    error={errors.name}
                    helperText={errors.name}
                />
                <TextField 
                    id="email" 
                    label="email" 
                    variant="outlined"
                    size='small'
                    onChange={e => { setData('email', e.target.value) }}
                    value={data.email}
                    sx={{
                        width: '100%'
                    }} 
                    type='email'
                    error={errors.email}
                    helperText={errors.email}
                />
                <TextField 
                    id="password" 
                    label="password" 
                    variant="outlined"
                    size='small'
                    onChange={e => { setData('password', e.target.value) }}
                    value={data.password}
                    sx={{
                        width: '100%'
                    }}
                    type='password' 
                    error={errors.password}
                    helperText={errors.password}
                />
                <TextField 
                    id="password_confirmation" 
                    label="confirm password" 
                    variant="outlined"
                    size='small'
                    onChange={e => { setData('password_confirmation', e.target.value) }}
                    value={data.password_confirmation}
                    sx={{
                        width: '100%'
                    }}
                    type='password'
                    error={errors.password_confirmation}
                    helperText={errors.password_confirmation}
                />

                <Box>
                  <FormControl fullWidth error={errors.role}>
                    <InputLabel id="role-lable" >Role</InputLabel>
                    <Select
                      labelId="role-lable"
                      id="role"
                      value={data.role}
                      label="Role"
                      onChange={ e => { setData('role', e.target.value) }}
                    >
                      <MenuItem value={'IT'}>IT</MenuItem>
                      <MenuItem value={'admin'}>Admin</MenuItem>
                      <MenuItem value={'field_operator'}>Field Operator</MenuItem>
                    </Select>
                    <FormHelperText>{errors.role}</FormHelperText>
                  </FormControl>
                </Box>

                <Box>
                  <Button type='submit' variant='contained' disabled={processing}>
                      Create
                  </Button>
                </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}