import React, { createContext, useContext, useEffect, useState } from "react";
import { checkForGameWin, checkForMatchWin, checkForSetWin, checkForTiebreaker } from "../lib/scoring";
import { MatchStatus, MatchType, Player, Set } from "../lib/types";

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

    const createNewSet = (lastSet?: Set) => {
        if (player1 && player2) {
            const lastGame = lastSet?.completedGames[lastSet.completedGames.length-1]
            const server = lastGame
                ? lastGame.server.name === player1.name ? player2 : player1
                : player1

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
    }

    const handleInitMatch = (player1: Player, player2: Player) => {
        setPlayer1(player1)
        setPlayer2(player2)
        setCompletedSets([])
        setMinutesPlayed(0);
        setMatchTimerLabel('00:00')

        createNewSet()
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

    useEffect(() => {
        if (matchType && player1 && player2 && completedSets && completedSets.length > 1) {
            const winner = checkForMatchWin(completedSets, matchType, player1, player2)
            if (winner) {
                setMatchWinner(winner)
                setMatchStatus(MatchStatus.COMPLETE)
                handleEndMatch()
            }
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

            updatedSet = checkForGameWin(updatedSet, player1, player2)
            updatedSet = checkForTiebreaker(updatedSet, player1, player2)
            if (!updatedSet.tiebreak) {
                updatedSet = checkForSetWin(updatedSet, player1, player2)
            }

            if (updatedSet.winner && completedSets) {
                setCompletedSets([...completedSets, updatedSet])
                createNewSet(updatedSet)
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
