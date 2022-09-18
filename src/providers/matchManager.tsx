import React, { createContext, useContext, useEffect, useState } from "react";
import { Game, GameScore, MatchStatus, MatchType, matchTypeWinningSetCount, Player, Set } from "../lib/types";

interface MatchManagerContextT {
    matchStatus: MatchStatus | null
    matchType: MatchType | null
    matchWinner: Player | null
    player1: Player | null
    player2: Player | null
    inProgressSet: Set | null
    completedSets: Set[] | null
    matchTimerLabel: string | null
    handleNewMatch: (type: MatchType) => void
    handleInitMatch: (player1: Player, player2: Player) => void
    handleStartMatch: () => void
    handlePoint: (to: Player) => void
    handleEndMatch: () => void
    handleCloseMatch: () => void
}

export const MatchManagerContext = createContext<MatchManagerContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

export const MatchManagerProvider: React.FC<ProviderProps> = ({ children }) => {
    const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);
    const [matchType, setMatchType] = useState<MatchType | null>(null);
    const [matchWinner, setMatchWinner] = useState<Player | null>(null);
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null);
    const [inProgressSet, setInProgressSet] = useState<Set | null>(null);
    const [completedSets, setCompletedSets] = useState<Set[] | null>(null);

    // Match Timer
    const [minutesPlayed, setMinutesPlayed] = useState<number>(0);
    const [matchTimerInterval, setMatchTimerInterval] = useState<NodeJS.Timer | null>(null);
    const [matchTimerLabel, setMatchTimerLabel] = useState<string | null>(null);

    useEffect(() => {
        if (matchTimerInterval) {
            console.log('timer updated:', minutesPlayed)
            setMatchTimerLabel(`00:${minutesPlayed.toString().padStart(2, '0')}`)
        }
    }, [minutesPlayed, matchTimerInterval])

    const handleNewMatch = (type: MatchType) => {
        setMatchType(type)
        setMatchStatus(MatchStatus.CREATING)
    }

    const createNewSet = (server: Player) => {
        const newSet: Set = {
            currentGame: {
                server,
                player1Score: 0,
                player2Score: 0
            },
            completedGames: []
        }
        setInProgressSet(newSet)
    }

    const handleInitMatch = (player1: Player, player2: Player) => {
        setPlayer1(player1)
        setPlayer2(player2)
        setCompletedSets([])
        setMinutesPlayed(0);
        setMatchTimerLabel('00:00')

        createNewSet(player1)
        setMatchStatus(MatchStatus.PENDING_START)
    }

    const incrementTimer = () => {
        setMinutesPlayed(minutesPlayed + 1)
    }

    const handleStartMatch = () => {
        setMatchStatus(MatchStatus.IN_PROGRESS)

        // Start timer
        const interval = setInterval(incrementTimer, 60000)
        setMatchTimerInterval(interval)
    }

    const checkForGameWin = (set: Set): Set => {
        if (inProgressSet && player1 && player2) {
            const game = set.currentGame
            if (game.player1Score > GameScore.FOURTY && (game.player1Score - game.player2Score) >= 2) {
                game.winner = player1
            } else if (game.player2Score > GameScore.FOURTY && (game.player2Score - game.player1Score) >= 2) {
                game.winner = player2
            }

            if (game.winner) {
                const newGame: Game = {
                    server: game.server.name === player1.name ? player2 : player1,
                    player1Score: 0,
                    player2Score: 0
                }
                return {
                    ...set,
                    currentGame: newGame,
                    completedGames: [...inProgressSet.completedGames, game]
                }
            } else {
                return {
                    ...set,
                    currentGame: game
                }
            }
        }
        return set
    }

    const checkForTiebreaker = (set: Set): Set => {
        if (inProgressSet && player1 && player2) {
            const player1Games = inProgressSet.completedGames.filter(g => g.winner?.name === player1.name).length
            const player2Games = inProgressSet.completedGames.filter(g => g.winner?.name === player2.name).length
            console.log('checking for tiebreak: ', player1Games, player2Games)
            if (player1Games === 6 && player2Games === 6) {
                return {
                    ...set,
                    tiebreak: {
                        player1Score: 0,
                        player2Score: 0
                    }
                }
            }
        }
        return set
    }

    const checkForSetWin = (set: Set): Set => {
        if (player1 && player2) {
            if (!set.tiebreak) {
                const player1Games = set.completedGames.filter(g => g.winner?.name === player1.name).length
                const player2Games = set.completedGames.filter(g => g.winner?.name === player2.name).length
                console.log('checking for set win:', player1Games, 'to', player2Games)
                if ((player1Games >= 6 && (player1Games - player2Games) >= 2)) {
                    return {
                        ...set,
                        winner: player1
                    }
                } else if (player2Games >= 6 && (player2Games - player1Games) >= 2) {
                    return {
                        ...set,
                        winner: player2
                    }
                }
            }
        }
        return set
    }

    const checkForMatchWin = (completedSets: Set[], matchType: MatchType) => {
        const setsRequired = matchTypeWinningSetCount.get(matchType)
        if (player1 && player2 && setsRequired) {
            const player1Sets = completedSets.filter(s => s.winner?.name === player1.name).length
            const player2Sets = completedSets.filter(s => s.winner?.name === player2.name).length
            console.log('checking for match win:', player1Sets, 'to', player2Sets)
            if (player1Sets === setsRequired) {
                setMatchWinner(player1)
                setMatchStatus(MatchStatus.COMPLETE)
                handleEndMatch()
            } else if (player2Sets === setsRequired) {
                setMatchWinner(player2)
                setMatchStatus(MatchStatus.COMPLETE)
                handleEndMatch()
            }
        }
    }

    useEffect(() => {
        if (matchType && completedSets && completedSets.length > 1) {
            checkForMatchWin(completedSets, matchType)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchType, completedSets])

    const handlePoint = (toPlayer: Player) => {
        if (inProgressSet && player1 && player2) {
            let updatedSet = inProgressSet
            if (toPlayer.name === player1.name) {
                updatedSet.currentGame.player1Score++
            } else (
                updatedSet.currentGame.player2Score++
            )

            updatedSet = checkForGameWin(updatedSet)
            updatedSet = checkForTiebreaker(updatedSet)
            if (!updatedSet.tiebreak) {
                updatedSet = checkForSetWin(updatedSet)
            }

            if (updatedSet.winner && completedSets) {
                setCompletedSets([...completedSets, updatedSet])
                createNewSet(player1)
            } else {
                setInProgressSet({...updatedSet})
            }
        }
    }

    const handleEndMatch = () => {
        // Stop timer
        if (matchTimerInterval) {
            clearInterval(matchTimerInterval)
            setMatchTimerInterval(null)
        }
    }

    const handleCloseMatch = () => {
        setMatchStatus(null)
        setMatchType(null)
        setMatchWinner(null)
        setPlayer1(null)
        setPlayer2(null)
        setInProgressSet(null)
        setCompletedSets(null)
    }

    const contextValue: MatchManagerContextT = {
        matchStatus,
        matchType,
        matchWinner,
        player1,
        player2,
        inProgressSet,
        completedSets,
        matchTimerLabel,
        handleNewMatch,
        handleInitMatch,
        handleStartMatch,
        handlePoint,
        handleEndMatch,
        handleCloseMatch
    }

    return (
        <MatchManagerContext.Provider value={contextValue}>
            {children}
        </MatchManagerContext.Provider>
    )
}

export const useMatchManager = () => {
    return useContext(MatchManagerContext)
}
