import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { GameScore, MatchStatus, Player, Set } from '../../lib/types'
import { useMatchManager } from '../../providers/matchManager'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'

const gameScoreMap = new Map<number, string>([
    [GameScore.ZERO, '0'],
    [GameScore.FIFTEEN, '15'],
    [GameScore.THIRTY, '30'],
    [GameScore.FOURTY, '40'],
])

export const MatchScore = () => {
    const {
        player1,
        player2,
        inProgressSet,
        completedSets,
        matchStatus
    } = useMatchManager()
    if (!player1 || !player2 || !inProgressSet || !completedSets) return null

    const gameScoreLabels = (): string[] => {
        const player1Score = inProgressSet.currentGame.player1Score
        const player2Score = inProgressSet.currentGame.player2Score

        // Regular scores
        const regularScore1 = gameScoreMap.get(player1Score)
        const regularScore2 = gameScoreMap.get(player2Score)
        if (regularScore1 && regularScore2) {
            return [regularScore1, regularScore2]
        }

        // Deuce scores
        if (player1Score === player2Score) {
            return ['40', '40']
        } else {
            return player1Score > player2Score
                ? ['ADV', '']
                : ['', 'ADV']
        }
    }
    const scoreLabels = gameScoreLabels()

    const getCurrentSetScore = (player: Player): number => {
        return inProgressSet.completedGames
            .filter(g => g.winner?.name === player.name)
            .length || 0
    }

    const getCompletedSetScore = (set: Set, player: Player): number => {
        return set.completedGames
            .filter(g => g.winner?.name === player.name)
            .length
    }

    return (
        <Stack direction='column' spacing={0.1} width='100%' alignItems='center'>

            <Stack direction='row' width='100%' justifyContent='center'>
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
                    {matchStatus === MatchStatus.IN_PROGRESS
                        && inProgressSet.currentGame.server.name === player1.name && (
                            <ArrowLeftIcon fontSize='medium' />
                        )}
                </Box>
                {matchStatus === MatchStatus.IN_PROGRESS && (
                    <>
                        <Box bgcolor='secondary.main' width='7%' minWidth={50}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' fontSize={18} fontWeight={600}>
                                {scoreLabels[0]}
                            </Typography>
                        </Box>
                        <Box bgcolor='primary.light' width='6%' minWidth={40}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                                {getCurrentSetScore(player1)}
                            </Typography>
                        </Box>
                    </>
                )}
                {completedSets.map((set, i) => (
                    <Box key={i}
                        bgcolor='primary.light' width={'6%'} minWidth={40}
                        display='flex' alignItems='center' justifyContent='center'
                        borderLeft='1px solid' borderColor='rgba(0, 0, 0, 0.1)'
                    >
                        <Typography textAlign='center'
                            color='ButtonText'
                            fontSize={18} fontWeight={600}
                            sx={set.winner?.name !== player1.name ? { opacity: 0.4 } : {}}
                        >
                            {getCompletedSetScore(set, player1)}
                        </Typography>
                    </Box>
                ))}
            </Stack>
            <Stack direction='row' width='100%' justifyContent='center'>
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
                    {matchStatus === MatchStatus.IN_PROGRESS
                        && inProgressSet.currentGame.server.name === player2.name && (
                        <ArrowLeftIcon fontSize='medium' />
                    )}
                </Box>
                {matchStatus === MatchStatus.IN_PROGRESS && (
                    <>
                        <Box bgcolor='secondary.main' width='7%' minWidth={50}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' fontSize={18} fontWeight={600}>
                                {scoreLabels[1]}
                            </Typography>
                        </Box>
                        <Box bgcolor='primary.light' width='6%' minWidth={40}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                                {getCurrentSetScore(player2)}
                            </Typography>
                        </Box>
                    </>
                )}
                {completedSets.map((set, i) => (
                    <Box key={i}
                        bgcolor='primary.light' width={'6%'} minWidth={40}
                        display='flex' alignItems='center' justifyContent='center'
                        borderLeft='1px solid' borderColor='rgba(0, 0, 0, 0.1)'
                    >
                        <Typography textAlign='center'
                            color='ButtonText'
                            fontSize={18} fontWeight={600}
                            sx={set.winner?.name !== player2.name ? { opacity: 0.4 } : {}}
                        >
                            {getCompletedSetScore(set, player2)}
                        </Typography>
                    </Box>
                ))}
            </Stack>

        </Stack>
    )
}
