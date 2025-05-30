import Auth from '../Layout/Auth'
import { Box, Typography, Paper, Button } from '@mui/material'

import { Link } from '@inertiajs/react'

import TankInfo from './tank_info'
import PolicyInfo from './policy_info'

export default function Show({
    fuelTank
}) {
    return (<>
        <Auth 
            headerTitle={'Tanks Details'} 
            pollingToggle={<Link href={route('tanks.edit', fuelTank.id)}>
                <Button variant='contained' sx={{ mr: 1.5 }}>Edit</Button>
            </Link>}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
                <TankInfo fuelTank={fuelTank}/>
                <Box>
                    <Typography variant='h6'>
                        Policies
                    </Typography>
                    {fuelTank.alert_policies.length !== 0 ? <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
                        {fuelTank.alert_policies.map((policy) => {
                            return ( <PolicyInfo key={policy.id} policy={policy}/> )
                        })}
                    </Box> : <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            rowGap: 2,
                            padding: 2,
                        }}
                    >
                        No Policies Registered
                    </Box>}
                </Box>
            </Box>
        </Auth>
    </>)
}