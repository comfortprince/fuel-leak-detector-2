import { Box, Typography, TextField, Button, Paper } from '@mui/material'
import { useForm, Link } from '@inertiajs/react'

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: ''
    })
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/auth/login');
    }

    return (<Box sx={{ 
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Paper
            component={'form'}

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
                    Log In
                </Typography>
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
                    type='password'
                    size='small' 
                    label='Password'
                    onChange={(e) => { setData('password', e.target.value) }}
                    error={errors?.password}
                    helperText={errors?.password}
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ mb: 1 }}>
                    <Button variant='contained' type='submit'>
                        Login
                    </Button>
                </Box>
                <Box>
                    <Link href={'/auth/register'}>
                        Don't have an account? Create one here.
                    </Link>
                </Box>
            </Box>
        </Paper>
    </Box>)
}