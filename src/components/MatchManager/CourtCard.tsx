import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useMatchManager } from '../../providers/matchManager'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'

export const CourtCard = () => {
    const {
        player1,
        player2,
        inProgressSet
    } = useMatchManager()

    const getScore = () => {
        if (inProgressSet && inProgressSet.currentGame) {
            return inProgressSet.currentGame.player1Score + inProgressSet.currentGame.player2Score
        }
        return 0
    }
    const scoreSum = getScore()

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
                        { scoreSum % 2 === 1 ?
                            inProgressSet?.currentGame.server.name === player1?.name ? (
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
                            )
                        : null}
                        <Typography
                            variant='h6'
                            color={inProgressSet?.currentGame.server.name === player1?.name ? 'primary.dark' : ''}
                        >
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
                        { scoreSum % 2 === 0 ?
                            inProgressSet?.currentGame.server.name === player1?.name ? (
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
                            )
                        : null}
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
                        { scoreSum % 2 === 0 ?
                            inProgressSet?.currentGame.server.name === player2?.name ? (
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
                            )
                        : null}
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
                        { scoreSum % 2 === 1 ?
                            inProgressSet?.currentGame.server.name === player2?.name ? (
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
                            )
                        : null}
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}
