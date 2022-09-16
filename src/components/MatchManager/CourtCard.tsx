import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../../providers/matchManager'

export const CourtCard = () => {
    const {
        player1,
        player2,
        inProgressSet
    } = useMatchManager()

    return (
        <Box sx={{ width: '100%' }} display='flex' alignItems='center' justifyContent='center'>
            <Stack direction='column' width='30%' height={100}>
                <Stack direction='row' width='100%' height={50}>
                    <Box
                        borderRight='1px solid' borderBottom='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        
                    </Box>
                    <Box
                        borderBottom='1px solid' borderLeft='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant='h6'
                            color={inProgressSet?.currentGame.server.name === player1?.name ? 'primary.dark' : ''}
                        >
                            {player1?.name}
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction='row' width='100%' height={50}>
                    <Box
                        borderTop='1px solid' borderRight='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant='h6'
                            color={inProgressSet?.currentGame.server.name === player2?.name ? 'primary.dark' : ''}
                        >
                            {player2?.name}
                        </Typography>
                    </Box>
                    <Box
                        borderLeft='1px solid' borderTop='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}
