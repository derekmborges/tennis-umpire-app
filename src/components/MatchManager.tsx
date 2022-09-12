import { Box, Container, Fade, Typography } from '@mui/material'
import React from 'react'

export const MatchManager = () => {
    return (
        <Container maxWidth="sm">
            <Fade in timeout={1000}>

                {/* Title */}
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2
                }}>
                    <Typography variant='h3'>
                        Match Manager
                    </Typography>
                </Box>

                {/* Matches */}
                

            </Fade>
        </Container>
    )
}
