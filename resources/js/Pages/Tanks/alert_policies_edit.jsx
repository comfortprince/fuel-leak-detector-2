import { 
    Button, 
    Box, 
    Typography, 
    TextField, 
    Select, 
    InputLabel, 
    MenuItem, 
    Chip, 
    FormControl,
    FormHelperText,
    IconButton
} from '@mui/material';

import { Link, useForm } from '@inertiajs/react';

import CloseIcon from '@mui/icons-material/Close';

export default function AlertPoliciesEdit({
    data,
    errors,
    setData
}) {
    const handleAddPolicy = () => {
        setData('alert_policies', [...data.alert_policies, {
            mq2_min: '',
            mq2_max: '',
            bmp180_min: '',
            bmp180_max: '',
            alert_type: '',
            policy_status: '',
            alert_message: ''
        }])
    }

    return <Box>
        <Typography 
            variant='subtitle1'
            sx={{
                fontWeight: '500'
            }}
        >
            Alert Policies
        </Typography>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 1
            }}
        >
            {data.alert_policies.map((policy, i) => {
                return <Policy 
                    key={i} 
                    index={i} 
                    data={data} 
                    errors={errors} 
                    setData={setData} 
                />
            })}
        </Box>
        <Box sx={{ mt: 2 }}>
            <Button 
                variant='contained' 
                color='secondary' 
                size='small'
                onClick={handleAddPolicy}
            >
                Add Policy +
            </Button>
        </Box>
    </Box>
}

function Policy({
    index,
    data, 
    errors, 
    setData 
}) {
    const policyData = data.alert_policies[index];
    const { delete: destroy, processing } = useForm({})

    const handlePolicyDelete = function (policyId) {
        destroy(route('alert-policies.destroy', policyId));
    }
    
    const handleChange = (e, policyKey) => { 
        const nextAlertPolicies = data.alert_policies.map((policy, i) => {
            if(i !== index) {
                return policy
            }

            return {
                ...policy,
                [policyKey]: e.target.value
            }
        })

        setData('alert_policies', nextAlertPolicies)
    }

    const removeLastPolicy = () => {
        setData('alert_policies', [...data.alert_policies.slice(0, -1)])            
    }

    return <Box
        sx={{
            mt:'0.25rem',
            display:'flex',
            flexDirection:'column',
            rowGap:'0.5rem',
            boxShadow: 1,
        }}
    >
        <Box
            elevation="1"
            sx={{
                border: 1,
                borderRadius: 1,
                borderColor: 'lightgray',
                p: 1,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton 
                    aria-label="close"
                    onClick={removeLastPolicy}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <Box 
                    sx={{
                        display:'flex',
                        flexDirection:'column',
                        width: '50%',
                        gap: 1.5
                    }}
                >
                    <Box>
                        <TextField 
                            id="" 
                            size="small" 
                            label={ policyData.mq2_min ? '' : 'MQ2_min' } 
                            variant="outlined"
                            value={policyData.mq2_min} 
                            onChange={(e) => { handleChange(e, 'mq2_min') }}
                            error={errors[`alert_policies.${index}.mq2_min`] ? true : false}
                            helperText={errors[`alert_policies.${index}.mq2_min`]}
                        />
                    </Box>
                    <Box>
                        <TextField 
                            id="" 
                            size="small" 
                            label={ policyData.mq2_max ? '' : 'MQ2_max' } 
                            variant="outlined"
                            value={policyData.mq2_max} 
                            onChange={(e) => { handleChange(e, 'mq2_max') }}
                            error={errors[`alert_policies.${index}.mq2_max`] ? true : false}
                            helperText={errors[`alert_policies.${index}.mq2_max`]}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display:'flex',
                        flexDirection:'column',
                        width: '50%',
                        gap: 1.5
                    }}
                >
                    <Box>
                        <TextField 
                            id="" 
                            size="small" 
                            label={ policyData.bmp180_min ? '' : 'BMP180_min' } 
                            variant="outlined"
                            value={policyData.bmp180_min} 
                            onChange={(e) => { handleChange(e, 'bmp180_min') }}
                            error={errors[`alert_policies.${index}.bmp180_min`] ? true : false}
                            helperText={errors[`alert_policies.${index}.bmp180_min`]}
                        />
                    </Box>
                    <Box>
                        <TextField 
                            id="" 
                            size="small" 
                            label={ policyData.bmp180_max ? '' : 'BMP180_max' } 
                            variant="outlined"
                            value={policyData.bmp180_max} 
                            onChange={(e) => { handleChange(e, 'bmp180_max') }}
                            error={errors[`alert_policies.${index}.bmp180_max`] ? true : false}
                            helperText={errors[`alert_policies.${index}.bmp180_max`]}
                        />
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mt: 1
                }}
            >
                <FormControl
                    sx={{
                        width: '50%'
                    }}
                    error={errors[`alert_policies.${index}.alert_type`] ? true : false}
                >
                    <InputLabel id="alert-type-select-label" sx={{ fontSize:'0.75rem' }}>Alert Type</InputLabel>
                    <Select
                        labelId="alert-type-select-label"
                        id="alert-type"
                        value={policyData.alert_type}
                        label="Alert Type"
                        size='small'
                        onChange={(e) => { handleChange(e, 'alert_type') }}
                    >
                        <MenuItem value={'warning'}>
                            <Chip label="warning" color='warning'/>
                        </MenuItem>
                        <MenuItem value={'critical'}>
                            <Chip label="critical" color='error'/>
                        </MenuItem>
                        <MenuItem value={'info'}>
                            <Chip label="info" color='info'/>
                        </MenuItem>
                    </Select>
                    {errors[`alert_policies.${index}.alert_type`] 
                        && <FormHelperText>{errors[`alert_policies.${index}.alert_type`]}</FormHelperText>}
                </FormControl>
                <FormControl
                    sx={{ width: '50%' }}
                    error={errors[`alert_policies.${index}.policy_status`] ? true : false}
                >
                    <InputLabel id="policy-status-select-label" sx={{ fontSize:'0.75rem' }}>Policy Status</InputLabel>
                    <Select
                        labelId="policy-status-select-label"
                        id="policy-status"
                        value={policyData.policy_status}
                        label="Policy Status"
                        size='small'
                        onChange={(e) => { handleChange(e, 'policy_status') }}
                    >
                        <MenuItem value={'active'}>
                            <Chip label="active" color='success'/>
                        </MenuItem>
                        <MenuItem value={'inactive'}>
                            <Chip label="inactive" color='secondary'/>
                        </MenuItem>
                    </Select>
                    {errors[`alert_policies.${index}.policy_status`] 
                        && <FormHelperText>{errors[`alert_policies.${index}.policy_status`]}</FormHelperText>}
                </FormControl>
            </Box>
            <Box sx={{ mt: 1.5 }}>
                <TextField 
                    id="" 
                    size="small" 
                    label={ policyData.alert_message ? '' : 'Alert Message' } 
                    variant="outlined"
                    value={policyData.alert_message} 
                    onChange={(e) => { handleChange(e, 'alert_message') }}
                    error={errors[`alert_policies.${index}.alert_message`] ? true : false}
                    helperText={errors[`alert_policies.${index}.alert_message`]}
                    sx={{ width: '100%' }}
                />
            </Box>
            <Button
                onClick={() => { handlePolicyDelete(policyData.id) }}
                sx={{ mt: 1.5 }}
                color='error' 
                variant='contained'
                type='button'
                disabled={processing}
            >
                Delete Policy
            </Button>
        </Box>
    </Box>
}