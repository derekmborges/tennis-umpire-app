import React, { createContext, useContext, useState } from "react";
import { MatchStatus, Player, Set } from "../lib/types";

interface MatchManagerContextT {
    matchStatus: MatchStatus | null
    player1: Player | null
    player2: Player | null
    inProgressSet: Set | null
    completedSets: Set[] | null
    handleNewGame: () => void
    handleInitGame: (player1: Player, player2: Player) => void
    handleStartGame: () => void
}

export const MatchManagerContext = createContext<MatchManagerContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

export const MatchManagerProvider: React.FC<ProviderProps> = ({ children }) => {
    const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null);
    const [player1, setPlayer1] = useState<Player | null>(null);
    const [player2, setPlayer2] = useState<Player | null>(null);
    const [inProgressSet, setInProgressSet] = useState<Set | null>(null);
    const [completedSets, setCompletedSets] = useState<Set[] | null>(null);

    const handleNewGame = () => {
        setMatchStatus(MatchStatus.CREATING)
    }

    const handleInitGame = (player1: Player, player2: Player) => {
        setPlayer1(player1)
        setPlayer2(player2)
        setCompletedSets([])
        
        const newSet: Set = {
            player1GamesWon: 0,
            player2GamesWon: 0
        }
        setInProgressSet(newSet)
    }

    const handleStartGame = () => {
        setMatchStatus(MatchStatus.IN_PROGRESS)
    }

    const contextValue: MatchManagerContextT = {
        matchStatus,
        player1,
        player2,
        inProgressSet,
        completedSets,
        handleNewGame,
        handleInitGame,
        handleStartGame
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
