import { Box, Typography, TextField, Button } from '@mui/material'
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
                Log In
            </Typography>
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
            <Box>
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
    </form>)
}