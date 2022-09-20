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
    if (!player1 || !player2 || !inProgressSet) return null

    const getScore = () => {
        if (inProgressSet.tiebreak) {
            return inProgressSet.tiebreak.player1Score + inProgressSet.tiebreak.player2Score
        } else {
            return inProgressSet.currentGame.player1Score + inProgressSet.currentGame.player2Score
        }
    }
    const scoreSum = getScore()

    const currentServer = inProgressSet.tiebreak
        ? inProgressSet.tiebreak.currentServer
        : inProgressSet.currentGame.server

    const serverOffsetL = inProgressSet.tiebreak && scoreSum > 0 ? 0 : 1
    const serverOffsetR = inProgressSet.tiebreak && scoreSum > 0 ? 1 : 0

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
                        { scoreSum % 2 === serverOffsetL ?
                            currentServer.name === player1.name ? (
                                <>
                                    <SportsTennisIcon fontSize='small' />
                                    <Typography
                                        variant='h6'
                                        color='primary.dark'
                                        ml={1}
                                    >
                                        {player1.name}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant='h6'>
                                    {player1.name}
                                </Typography>
                            )
                        : null}
                        <Typography
                            variant='h6'
                            color={currentServer.name === player1.name ? 'primary.dark' : ''}
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
                        { scoreSum % 2 === serverOffsetR ?
                            currentServer.name === player1.name ? (
                                <>
                                    <SportsTennisIcon fontSize='small' />
                                    <Typography
                                        variant='h6'
                                        color='primary.dark'
                                        ml={1}
                                    >
                                        {player1.name}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant='h6'>
                                    {player1.name}
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
                        { scoreSum % 2 === serverOffsetR ?
                            currentServer.name === player2.name ? (
                                <>
                                    <SportsTennisIcon fontSize='small' />
                                    <Typography
                                        variant='h6'
                                        color='primary.dark'
                                        ml={1}
                                    >
                                        {player2.name}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant='h6'>
                                    {player2.name}
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
                        { scoreSum % 2 === serverOffsetL ?
                            currentServer.name === player2.name ? (
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
