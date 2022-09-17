import React, { createContext, useContext, useEffect, useState } from "react";
import { Game, GameScore, MatchStatus, MatchType, Player, Set } from "../lib/types";

interface MatchManagerContextT {
    matchStatus: MatchStatus | null
    matchType: MatchType | null
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
}

export const MatchManagerContext = createContext<MatchManagerContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

export const MatchManagerProvider: React.FC<ProviderProps> = ({ children }) => {
    const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);
    const [matchType, setMatchType] = useState<MatchType | null>(null);
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

    const handleStartMatch = () => {
        setMatchStatus(MatchStatus.IN_PROGRESS)

        // Start timer
        const interval = setInterval(() => setMinutesPlayed(minutesPlayed+1), 60000)
        setMatchTimerInterval(interval)
    }

    const checkForGameWin = (game: Game): boolean => {
        if (inProgressSet && player1 && player2) {
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
                setInProgressSet({
                    ...inProgressSet,
                    currentGame: newGame,
                    completedGames: [...inProgressSet.completedGames, game]
                })
                return true
            } else {
                setInProgressSet({
                    ...inProgressSet,
                    currentGame: game
                })
            }
        }
        return false
    }

    const checkForTiebreaker = (): boolean => {
        if (inProgressSet && player1 && player2) {
            const player1Games = inProgressSet.completedGames.filter(g => g.winner?.name === player1.name).length
            const player2Games = inProgressSet.completedGames.filter(g => g.winner?.name === player2.name).length

            if (player1Games === 6 && player2Games === 6) {
                setInProgressSet({
                    ...inProgressSet,
                    tiebreak: {
                        player1Score: 0,
                        player2Score: 0
                    }
                })
                return true
            }
        }
        return false
    }

    const checkForSetWin = () => {
        const set = inProgressSet
        if (set && player1 && player2) {
            if (!set.tiebreak) {
                const player1Games = set.completedGames.filter(g => g.winner?.name === player1.name).length
                const player2Games = set.completedGames.filter(g => g.winner?.name === player2.name).length
                console.log('checking for set win:', player1Games, 'to', player2Games)
                if ((player1Games >= 6 && (player1Games - player2Games) >= 2) ) {
                    set.winner = player1
                } else if (player2Games >= 6 && (player2Games - player1Games) >= 2) {
                    set.winner = player2
                }

                if (set.winner && completedSets) {
                    setCompletedSets([...completedSets, set])
                    createNewSet(player1)
                }
            }
        }
    }

    const handlePoint = (toPlayer: Player) => {
        const updatedGame = inProgressSet?.currentGame
        if (updatedGame && player1 && player2) {
            if (toPlayer.name === player1.name) {
                updatedGame.player1Score++
            } else (
                updatedGame.player2Score++
            )

            const gameEnded = checkForGameWin(updatedGame)
            if (gameEnded) {
                const inTiebreaker = checkForTiebreaker()
                if (!inTiebreaker) {
                    checkForSetWin()
                }
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

    const contextValue: MatchManagerContextT = {
        matchStatus,
        matchType,
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
