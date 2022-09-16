import React, { createContext, useContext, useEffect, useState } from "react";
import { MatchStatus, MatchType, Player, Set } from "../lib/types";

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

    const handleInitMatch = (player1: Player, player2: Player) => {
        setPlayer1(player1)
        setPlayer2(player2)
        setCompletedSets([])
        setMinutesPlayed(0);
        setMatchTimerLabel('00:00')
        
        const newSet: Set = {
            currentGame: {
                server: player1,
                player1Score: 0,
                player2Score: 0
            },
            completedGames: []
        }
        setInProgressSet(newSet)
        setMatchStatus(MatchStatus.PENDING_START)
    }

    const handleStartMatch = () => {
        setMatchStatus(MatchStatus.IN_PROGRESS)

        // Start timer
        const interval = setInterval(() => setMinutesPlayed(minutesPlayed+1), 60000)
        setMatchTimerInterval(interval)
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
        handleEndMatch
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
