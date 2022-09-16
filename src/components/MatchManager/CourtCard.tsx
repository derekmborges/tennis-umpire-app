import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../../providers/matchManager'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'

export const CourtCard = () => {
    const {
        player1,
        player2,
        inProgressSet
    } = useMatchManager()

    return (
        <Box width='100%' height={150} display='flex' alignItems='center' justifyContent='center'>
            <Stack direction='row' width='100%' height={150} justifyContent='center'>
                <Stack direction='column' width='25%' minWidth={200} height={150}>
                    <Box
                        borderRight='1px solid' borderBottom='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant='h6'
                            color={inProgressSet?.currentGame.server.name === player1?.name ? 'primary.dark' : ''}
                        >
                            {/* {player1?.name} */}
                        </Typography>
                    </Box>
                    <Box
                        borderTop='1px solid' borderRight='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {inProgressSet?.currentGame.server.name === player1?.name ? (
                            <>
                                <SportsTennisIcon fontSize='small' />
                                <Typography
                                    variant='h6'
                                    color='primary.dark'
                                    ml={1}
                                >
                                    {player1?.name}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant='h6'>
                                {player1?.name}
                            </Typography>
                        )}
                    </Box>
                </Stack>
                <Stack direction='column' width='25%' minWidth={200} height={150}>
                    <Box
                        borderLeft='1px solid' borderBottom='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {inProgressSet?.currentGame.server.name === player2?.name ? (
                            <>
                                <SportsTennisIcon fontSize='small' />
                                <Typography
                                    variant='h6'
                                    color='primary.dark'
                                    ml={1}
                                >
                                    {player2?.name}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant='h6'>
                                {player2?.name}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        borderLeft='1px solid' borderTop='1px solid' borderColor='primary.main'
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant='h6'
                            color={inProgressSet?.currentGame.server.name === player2?.name ? 'primary.dark' : ''}
                        >
                            {/* {player2?.name} */}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}
