import { Box, Typography, TextField, Button } from '@mui/material'
import { useForm } from '@inertiajs/react'

export default function Regiter() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/auth/register');
    }

    return (<form 
        style={{ 
            display: 'flex', 
            alignItems:'center', 
            flexDirection:'column', 
            rowGap: '0.5rem', 
            width: '100%', marginTop: '3rem' 
        }}

        onSubmit={handleSubmit}
    >
        <Box>
            <Typography variant='h4'>
                Register
            </Typography>
        </Box>
        <Box>
            <TextField 
                id='name' 
                size='small' 
                label='Name'
                onChange={(e) => { setData('name', e.target.value) }}
                error={errors?.name}
                helperText={errors?.name}
            />
        </Box>
        <Box>
            <TextField 
                id='email' 
                size='small' 
                label='Email'
                onChange={(e) => { setData('email', e.target.value) }}
                error={errors?.email}
                helperText={errors?.email}
            />
        </Box>
        <Box>
            <TextField 
                id='password' 
                size='small' 
                label='Password'
                onChange={(e) => { setData('password', e.target.value) }}
                error={errors?.password}
                helperText={errors?.password}
            />
        </Box>
        <Box>
            <TextField 
                id='password_confirmation' 
                size='small' 
                label='Confirm'
                onChange={(e) => { setData('password_confirmation', e.target.value) }}
                error={errors?.password_confirmation}
                helperText={errors?.password_confirmation}
            />
        </Box>
        <Box>
            <Button variant='contained' type='submit'>
                Sign Up
            </Button>
        </Box>
    </form>)
}