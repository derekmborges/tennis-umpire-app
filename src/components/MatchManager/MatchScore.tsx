import { Box, Collapse, createTheme, List, responsiveFontSizes, Stack, Typography } from '@mui/material'
import React from 'react'
import { GameScore, MatchStatus, Player, Set } from '../../lib/types'
import { useMatchManager } from '../../providers/matchManager'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

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
        matchStatus,
        currentSetPoint,
        currentMatchPoint,
        pastSetPoints,
        pastMatchPoints
    } = useMatchManager()
    if (!player1 || !player2 || !inProgressSet || !completedSets) return null

    const gameScoreLabels = (): string[] => {
        if (!inProgressSet.tiebreak) {
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
        } else {
            return [
                inProgressSet.tiebreak.player1Score.toString(),
                inProgressSet.tiebreak.player2Score.toString()
            ]
        }
    }
    const scoreLabels = gameScoreLabels()

    const getCurrentSetScore = (player: Player): number => {
        return inProgressSet.completedGames
            .filter(g => g.winner?.name === player.name)
            .length || 0
    }

    const getCompletedSetScore = (set: Set, player: Player): number => {
        const numGames = set.completedGames
            .filter(g => g.winner?.name === player.name)
            .length
        if (set.tiebreak && set.winner?.name === player.name) {
            return numGames + 1
        } else {
            return numGames
        }
    }

    const currentServer = inProgressSet.tiebreak
        ? inProgressSet.tiebreak.currentServer
        : inProgressSet.currentGame.server

    const numSetPoint = (currentSetPoint && pastSetPoints && pastSetPoints.length > 0)
        ? pastSetPoints.length + 1
        : null

    const numMatchPoint = (currentMatchPoint && pastMatchPoints && pastMatchPoints.length > 0)
        ? pastMatchPoints.length + 1
        : null

    return (
        <Stack direction='column' spacing={0.1} width='100%' alignItems='center'>

            <Stack direction='row' width='100%' height={20} justifyContent='center'>
                <Box width='22%' display='flex' alignItems='center'>
                    {currentMatchPoint ? (
                        <Typography variant='caption' color='secondary.main'>
                            Match Point {numMatchPoint && `#${numMatchPoint}`}
                        </Typography>
                    ) : currentSetPoint ? (
                        <Typography variant='caption' color='secondary.main'>
                            Set Point {numSetPoint && `#${numSetPoint}`}
                        </Typography>
                    ) : null}
                </Box>
                <Box width='24%' minWidth={50}
                    display='flex' alignItems='center' justifyContent='end'
                >
                    {inProgressSet.tiebreak && (
                        <Typography textAlign='center' variant='caption'>
                            Tiebreak
                        </Typography>
                    )}
                </Box>
            </Stack>

            <Stack direction='row' width='100%' justifyContent='center'>
                <Stack
                    direction='row'
                    width='20%' minWidth={100}
                    bgcolor='primary.dark'
                    alignItems='center'
                >
                    <Typography variant='h5' mr={1} ml={0.2}>
                        {player1.countryFlag}
                    </Typography>
                    <Typography variant='h6'>
                        {player1.name}
                    </Typography>
                    {player1.rank && (
                        <Typography
                            variant='caption'
                            color='primary.light'
                            ml={0.5}
                            pb={1}
                        >
                            ({player1.rank})
                        </Typography>
                    )}
                </Stack>
                <Box
                    bgcolor='primary.dark' width='3%' minWidth={15}
                    display='flex' alignItems='center' justifyContent='start'
                >
                    {matchStatus !== MatchStatus.COMPLETE
                        && currentServer.name === player1.name && (
                            <ArrowLeftIcon fontSize='medium' />
                        )}
                </Box>
                <TransitionGroup style={{ display: 'flex', flexDirection: 'row' }}>
                    {completedSets.map((set, i) => (
                        <CSSTransition
                            key={i}
                            timeout={500}
                            classNames='fade'
                        >
                            <Box key={i}
                                bgcolor='primary.light' width='6%' minWidth={40}
                                display='flex' alignItems='center' justifyContent='center'
                                borderRight='1px solid' borderColor='rgba(0, 0, 0, 0.1)'
                            >
                                <Typography textAlign='center'
                                    color='ButtonText'
                                    fontSize={18} fontWeight={600}
                                    sx={set.winner?.name !== player1.name ? { opacity: 0.4 } : {}}
                                >
                                    {getCompletedSetScore(set, player1)}
                                </Typography>
                            </Box>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                {matchStatus !== MatchStatus.COMPLETE && (
                    <>
                        <Box bgcolor='primary.light' width='6%' minWidth={40}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                                {getCurrentSetScore(player1)}
                            </Typography>
                        </Box>
                        <Box bgcolor='secondary.main' width='7%' minWidth={50}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' fontSize={18} fontWeight={600}>
                                {scoreLabels[0]}
                            </Typography>
                        </Box>
                    </>
                )}
            </Stack>
            <Stack direction='row' width='100%' justifyContent='center'>
                <Stack
                    direction='row'
                    width='20%' minWidth={100}
                    bgcolor='primary.dark'
                    alignItems='center'
                >
                    <Typography variant='h5' mr={1} ml={0.2}>
                        {player2.countryFlag}
                    </Typography>
                    <Typography variant='h6'>
                        {player2.name}
                    </Typography>
                    {player2.rank && (
                        <Typography
                            variant='caption'
                            color='primary.light'
                            ml={0.5}
                            pb={1}
                        >
                            ({player2.rank})
                        </Typography>
                    )}
                </Stack>
                <Box
                    bgcolor='primary.dark' width='3%' minWidth={15}
                    display='flex' alignItems='center' justifyContent='start'
                >
                    {matchStatus !== MatchStatus.COMPLETE
                        && currentServer.name === player2.name && (
                            <ArrowLeftIcon fontSize='medium' />
                        )}
                </Box>
                <TransitionGroup style={{ display: 'flex', flexDirection: 'row' }}>
                    {completedSets.map((set, i) => (
                        <CSSTransition
                            key={i}
                            timeout={500}
                            classNames='fade'
                        >
                            <Box key={i}
                                bgcolor='primary.light' width='6%' minWidth={40}
                                display='flex' alignItems='center' justifyContent='center'
                                borderRight='1px solid' borderColor='rgba(0, 0, 0, 0.1)'
                            >
                                <Typography textAlign='center'
                                    color='ButtonText'
                                    fontSize={18} fontWeight={600}
                                    sx={set.winner?.name !== player2.name ? { opacity: 0.4 } : {}}
                                >
                                    {getCompletedSetScore(set, player2)}
                                </Typography>
                            </Box>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                {matchStatus !== MatchStatus.COMPLETE && (
                    <>
                        <Box bgcolor='primary.light' width='6%' minWidth={40}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                                {getCurrentSetScore(player2)}
                            </Typography>
                        </Box>
                        <Box bgcolor='secondary.main' width='7%' minWidth={50}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            <Typography textAlign='center' fontSize={18} fontWeight={600}>
                                {scoreLabels[1]}
                            </Typography>
                        </Box>
                    </>
                )}
            </Stack>

        </Stack>
    )
}
