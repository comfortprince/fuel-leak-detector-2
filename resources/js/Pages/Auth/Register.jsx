import { Box, Typography, TextField, Button, Paper } from '@mui/material'
import { useForm, Link } from '@inertiajs/react'

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

    return (<Box sx={{ 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
     }}>
        <Paper
            component='form'
            variant='outlined'

            style={{ 
                display: 'flex', 
                alignItems:'center', 
                flexDirection:'column', 
                rowGap: '0.5rem', 
                width: '30%',
                borderRadius: 8,
                padding: '1rem'
            }}

            onSubmit={handleSubmit}
        >
            <Box sx={{ width: '100%' }}>
                <Typography 
                    variant='h4' 
                    sx={{ 
                        textAlign: 'start', 
                        width: '100%' 
                    }}
                >
                    Register
                </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <TextField 
                    id='name' 
                    size='small' 
                    label='Name'
                    onChange={(e) => { setData('name', e.target.value) }}
                    error={errors?.name}
                    helperText={errors?.name}
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <TextField 
                    id='email' 
                    size='small' 
                    label='Email'
                    onChange={(e) => { setData('email', e.target.value) }}
                    error={errors?.email}
                    helperText={errors?.email}
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <TextField 
                    id='password' 
                    size='small' 
                    label='Password'
                    onChange={(e) => { setData('password', e.target.value) }}
                    error={errors?.password}
                    helperText={errors?.password}
                    type='password'
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <TextField 
                    id='password_confirmation' 
                    size='small' 
                    label='Confirm'
                    onChange={(e) => { setData('password_confirmation', e.target.value) }}
                    error={errors?.password_confirmation}
                    helperText={errors?.password_confirmation}
                    type='password'
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ mb: 1 }}>
                    <Button variant='contained' type='submit'>
                        Sign Up
                    </Button>
                </Box>
                <Box>
                    <Link href={'/auth/login'}>
                        Already have an account? Log in here.
                    </Link>
                </Box>
            </Box>
        </Paper>
    </Box>)
}