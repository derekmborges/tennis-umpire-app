import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { Player, Set } from '../../lib/types'
import { useMatchManager } from '../../providers/matchManager'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'

export const MatchScore = () => {
    const {
        player1,
        player2,
        inProgressSet,
        completedSets
    } = useMatchManager()

    const getCurrentSetScore = (player: Player): number => {
        return inProgressSet?.completedGames
            .filter(g => g.winner?.name === player.name)
            .length || 0
    }

    const getCompletedSetScore = (set: Set, player: Player): number => {
        return set.completedGames
            .filter(g => g.winner?.name === player.name)
            .length
    }

    if (!player1 || !player2 || !inProgressSet || !completedSets) return null

    return (
        <Stack direction='column' spacing={0.1} width='100%' alignItems='center'>

            <Stack direction='row' width='100%'>
                <Box
                    bgcolor='primary.dark' width='25%'
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' variant='h6'>
                        {player1.name}
                    </Typography>
                </Box>
                <Box
                    bgcolor='primary.dark' width='3%'
                    display='flex' alignItems='center' justifyContent='start'
                >
                    { inProgressSet.currentGame.server.name === player1.name && (
                        <ArrowLeftIcon fontSize='large' />
                    )}
                </Box>
                <Box bgcolor='secondary.main' width='8%' minWidth={50}
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' fontSize={18} fontWeight={600}>
                        {inProgressSet.currentGame.player1Score}
                    </Typography>
                </Box>
                <Box bgcolor='primary.light' width='6%' minWidth={40}
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                        {getCurrentSetScore(player1)}
                    </Typography>
                </Box>
                {completedSets.map(set => (
                    <Box bgcolor='primary.light' width={'6%'} minWidth={40}
                        display='flex' alignItems='center' justifyContent='center'
                    >
                        <Typography textAlign='center'
                            color='ButtonText'
                            sx={set.winner?.name !== player1.name ? {opacity: 0.4} : {}}
                        >
                            {getCompletedSetScore(set, player1)}
                        </Typography>
                    </Box>
                ))}
            </Stack>
            <Stack direction='row' width='100%'>
                <Box
                    bgcolor='primary.dark' width='25%'
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' variant='h6'>
                        {player2.name}
                    </Typography>
                </Box>
                <Box
                    bgcolor='primary.dark' width='3%'
                    display='flex' alignItems='center' justifyContent='start'
                >
                    { inProgressSet.currentGame.server.name === player2.name && (
                        <ArrowLeftIcon fontSize='large' />
                    )}
                </Box>
                <Box bgcolor='secondary.main' width='8%' minWidth={50}
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' fontSize={18} fontWeight={600}>
                        {inProgressSet.currentGame.player2Score}
                    </Typography>
                </Box>
                <Box bgcolor='primary.light' width='6%' minWidth={40}
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                        {getCurrentSetScore(player2)}
                    </Typography>
                </Box>
                {completedSets.map(set => (
                    <Box bgcolor='primary.light' width={'6%'} minWidth={40}
                        display='flex' alignItems='center' justifyContent='center'
                    >
                        <Typography textAlign='center'
                            color='ButtonText'
                            sx={set.winner?.name !== player2.name ? {opacity: 0.4} : {}}
                        >
                            {getCompletedSetScore(set, player2)}
                        </Typography>
                    </Box>
                ))}
            </Stack>

        </Stack>
    )
}
