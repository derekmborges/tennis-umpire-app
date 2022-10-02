import { Box, Stack, Typography } from '@mui/material'
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
        ? pastSetPoints.filter(sp => sp.name === currentSetPoint.name).length + 1
        : null

    const numMatchPoint = (currentMatchPoint && pastMatchPoints && pastMatchPoints.length > 0)
        ? pastMatchPoints.filter(mp => mp.name === currentMatchPoint.name).length + 1
        : null

    const CompletedSets = ({ player }: { player: Player }): JSX.Element => {
        return (
            <TransitionGroup style={{
                display: 'flex',
                flexDirection: 'row',
                ...(completedSets.length > 0 && {
                    width: '8%',
                    minWidth: 40
                })
            }}>
                {completedSets.map((set, i) => (
                    <CSSTransition
                        key={i}
                        timeout={500}
                        classNames='fade'
                    >
                        <Box key={i}
                            bgcolor='primary.light' width='100%'
                            display='flex' alignItems='center' justifyContent='center'
                            borderRight='1px solid' borderColor='rgba(0, 0, 0, 0.1)'
                        >
                            <Typography textAlign='center'
                                color='ButtonText'
                                fontSize={18} fontWeight={600}
                                sx={set.winner?.name !== player.name ? { opacity: 0.4 } : {}}
                            >
                                {getCompletedSetScore(set, player)}
                            </Typography>
                        </Box>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        )
    }

    const InProgressSet = ({ player }: { player: Player }): JSX.Element => {
        return (
            <>
                <Box bgcolor='primary.light' width='5%' minWidth={40}
                    display='flex' alignItems='center' justifyContent='center'
                >
                    <Typography textAlign='center' color='ButtonText' fontSize={18} fontWeight={600}>
                        {getCurrentSetScore(player)}
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
        )
    }

    return (
        <Stack direction='column' spacing={0.1} width='100%' alignItems='center'>

            <Stack direction='row' width='100%' height={20} justifyContent='center'>
                <Stack
                    direction='row' alignItems='flex-start'
                    width='20%' minWidth={100}
                >
                    {currentMatchPoint ? (
                        <Typography variant='caption' fontWeight={600} color='warning.main' pl={1}>
                            Match Point {numMatchPoint && `#${numMatchPoint}`}
                        </Typography>
                    ) : currentSetPoint ? (
                        <Typography variant='caption' fontWeight={600} color='primary.dark' pl={1}>
                            Set Point {numSetPoint && `#${numSetPoint}`}
                        </Typography>
                    ) : null}
                </Stack>
                <Box width='3%' minWidth={15}></Box>
                {completedSets.map((_, i) => (
                    <Box key={i} width='4%' minWidth={40}></Box>
                ))}
                {matchStatus !== MatchStatus.COMPLETE && (
                    <>
                        <Box width='5%' minWidth={40}></Box>
                        <Box width='7%' minWidth={50}
                            display='flex' alignItems='center' justifyContent='center'
                        >
                            {inProgressSet.tiebreak && (
                                <Typography textAlign='center' variant='caption'>
                                    Tiebreak
                                </Typography>
                            )}
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
                <CompletedSets player={player1} />
                {matchStatus !== MatchStatus.COMPLETE && (
                    <InProgressSet player={player1} />
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
                <CompletedSets player={player2} />
                {matchStatus !== MatchStatus.COMPLETE && (
                    <InProgressSet player={player2} />
                )}
            </Stack>

        </Stack>
    )
}
