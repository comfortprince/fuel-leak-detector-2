import { useState } from 'react';

import { 
    Button, 
    Box, 
    TableContainer, 
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';

import Auth from '../Layout/Auth'
import CreateUserModal from './create_user';
import EditUserModal from './edit_user';

import { useForm } from '@inertiajs/react';

export default function Index ({
    users
}) {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const openCreateUserModal = () => setIsCreateUserModalOpen(true);
    const closeCreateUserModal = () => setIsCreateUserModalOpen(false);

    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const openEditUserModal = () => setIsEditUserModalOpen(true);
    const closeEditUserModal = () => setIsEditUserModalOpen(false);

    const { delete: destroy, processing: userDeleteProcessing } = useForm({})

    const handleUserDelete = (user) => {
        console.log(user);
        destroy(route('users.destroy', user.id));
    }

    return <Auth headerTitle={'Users'}>
        <Box>
            <Button variant='contained' onClick={openCreateUserModal}>
                Add User
            </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Role</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow
                                key={user.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                <TableCell align="right">{user.email}</TableCell>
                                <TableCell align="right">{user.role}</TableCell>
                                <TableCell 
                                    align="right" 
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'end', 
                                        columnGap: 1 
                                    }}
                                >
                                    <Button 
                                        variant='contained' 
                                        color='error'
                                        size='small'
                                        onClick={()=>{ handleUserDelete(user) }}
                                        disabled={userDeleteProcessing}
                                    >
                                        Delete
                                    </Button>
                                    <Button 
                                        variant='contained' 
                                        size='small'
                                        onClick={() => { 
                                            setUserToEdit(user)
                                            openEditUserModal() 
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        <CreateUserModal open={isCreateUserModalOpen} handleClose={closeCreateUserModal}/>
        {isEditUserModalOpen && <EditUserModal open={isEditUserModalOpen} handleClose={closeEditUserModal} user={userToEdit} />}
    </Auth>
}