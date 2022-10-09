import { Container, Box, Avatar, Typography, Paper, Button, LinearProgress } from '@mui/material'
import React from 'react'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from '../providers/authProvider'

export const Login = () => {
    const { authenticating, handleLogin } = useAuth()
    return (
        <Container maxWidth="md">
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant="h3" m={5}>
                    Tennis Match Manager
                </Typography>

                <Paper sx={{
                    mt: 8,
                    p: 2,
                    width: '50%',
                    minWidth: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {authenticating ? (
                        <Box width='100%' p={2}>
                            <Typography variant='h5' textAlign='center' mb={2}>
                                Authenticating...
                            </Typography>
                            <LinearProgress color="secondary" />
                        </Box>
                    ) : (
                        <>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <SportsTennisIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Button
                                fullWidth
                                startIcon={<GoogleIcon />}
                                variant="contained"
                                sx={{ mt: 3, mb: 3, ml: 2, mr: 2 }}
                                onClick={handleLogin}
                            >
                                Sign In With Google
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    )
}
