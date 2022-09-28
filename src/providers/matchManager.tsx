import React, { createContext, useContext, useEffect, useState } from "react";
import { checkForGameWin, checkForMatchPoint, checkForMatchWin, checkForSetPoint, checkForSetWin, checkForTiebreaker, checkForTiebreakSetWin } from "../lib/scoring";
import { Match, MatchStatus, MatchType, Player, Set } from "../lib/types";
import { useDatabase } from "./databaseProvider";

interface MatchManagerContextT {
    matchStatus: MatchStatus | null
    matchType: MatchType | null
    matchWinner: Player | null
    player1: Player | null
    player2: Player | null
    inProgressSet: Set | null
    completedSets: Set[] | null
    matchTimerLabel: string | null

    currentSetPoint: Player | null
    currentMatchPoint: Player | null
    pastSetPoints: Player[] | null
    pastMatchPoints: Player[] | null
    handleNewMatch: (type: MatchType) => void
    handleInitMatch: (player1: Player, player2: Player) => void
    handleStartMatch: () => void
    handlePoint: (to: Player) => void
    handleEndMatch: () => void
    handleCloseMatch: () => void
    handleRematch: () => void
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

    // Important points
    const [currentSetPoint, setCurrentSetPoint] = useState<Player | null>(null);
    const [pastSetPoints, setPastSetPoints] = useState<Player[] | null>(null);
    const [currentMatchPoint, setCurrentMatchPoint] = useState<Player | null>(null);
    const [pastMatchPoints, setPastMatchPoints] = useState<Player[] | null>(null);

    // Match Timer
    const [minutesPlayed, setMinutesPlayed] = useState<number>(0);
    const [matchTimerInterval, setMatchTimerInterval] = useState<NodeJS.Timer | null>(null);
    const [matchTimerLabel, setMatchTimerLabel] = useState<string | null>(null);

    // Database stuff
    const [databaseId, setDatabaseId] = useState<string | null>(null)
    const { handleAdd, handleUpdate } = useDatabase()

    useEffect(() => {
        if (matchTimerInterval) {
            console.log('timer updated:', minutesPlayed)
            setMatchTimerLabel(`00:${minutesPlayed.toString().padStart(2, '0')}`)
        }
    }, [minutesPlayed, matchTimerInterval])
    
    const saveMatch = async () => {
        if (matchStatus && matchType && player1 && player2 && inProgressSet && completedSets
        ) {
            if (matchStatus === MatchStatus.PENDING_START) {
                const match: Match = {
                    type: matchType,
                    status: matchStatus,
                    player1,
                    player2,
                    inProgressSet,
                    completedSets
                }
                const createdMatch = await handleAdd(match)
                if (createdMatch.id) {
                    setDatabaseId(createdMatch.id)
                }
            } else if (matchStatus === MatchStatus.IN_PROGRESS && databaseId) {
                const matchUpdates: Match = {
                    id: databaseId,
                    type: matchType,
                    status: matchStatus,
                    player1,
                    player2,
                    inProgressSet,
                    completedSets,
                    startTime: new Date()
                }
                handleUpdate(matchUpdates)
            } else if (matchStatus === MatchStatus.COMPLETE && matchWinner && databaseId) {
                const matchUpdates: Match = {
                    id: databaseId,
                    type: matchType,
                    status: matchStatus,
                    player1,
                    player2,
                    inProgressSet,
                    completedSets,
                    winner: matchWinner,
                    endTime: new Date()
                }
                handleUpdate(matchUpdates)
            }
        }
    }

    useEffect(() => {
        if (matchStatus && [MatchStatus.PENDING_START, MatchStatus.IN_PROGRESS, MatchStatus.COMPLETE].includes(matchStatus)) {
            saveMatch()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchStatus])

    const handleNewMatch = (type: MatchType) => {
        setMatchType(type)
        setMatchStatus(MatchStatus.CREATING)
    }

    const createNewSet = (player1: Player, player2: Player, lastSet?: Set) => {
        const lastGame = lastSet?.completedGames[lastSet.completedGames.length - 1]
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

    const handleInitMatch = (player1: Player, player2: Player) => {
        setPlayer1(player1)
        setPlayer2(player2)
        setCompletedSets([])
        setMinutesPlayed(0)
        setMatchTimerLabel('00:00')

        setCurrentSetPoint(null)
        setCurrentMatchPoint(null)
        setPastSetPoints([])
        setPastMatchPoints([])

        createNewSet(player1, player2)
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
            if (!updatedSet.tiebreak) {
                if (toPlayer.name === player1.name) {
                    updatedSet.currentGame.player1Score++
                } else (
                    updatedSet.currentGame.player2Score++
                )

                updatedSet = checkForGameWin(updatedSet, player1, player2)
                updatedSet = checkForTiebreaker(updatedSet, player1, player2)
                updatedSet = checkForSetWin(updatedSet, player1, player2)
            } else {
                if (toPlayer.name === player1.name) {
                    updatedSet.tiebreak.player1Score++
                } else (
                    updatedSet.tiebreak.player2Score++
                )

                // Update server every odd total points
                const scoreSum = updatedSet.tiebreak.player1Score + updatedSet.tiebreak.player2Score
                if (scoreSum % 2 === 1) {
                    updatedSet.tiebreak.currentServer = updatedSet.tiebreak.currentServer.name === player1.name ? player2 : player1
                }

                updatedSet = checkForTiebreakSetWin(updatedSet, player1, player2)
            }
            if (updatedSet.winner && completedSets) {
                setCompletedSets([...completedSets, updatedSet])
                createNewSet(player1, player2, updatedSet)

                setCurrentSetPoint(null)
                setPastSetPoints([])
                if (currentMatchPoint && pastMatchPoints) {
                    setPastMatchPoints([...pastMatchPoints, currentMatchPoint])
                }
            } else {
                setInProgressSet({ ...updatedSet })

                // move set point to past set points
                if (currentSetPoint && pastSetPoints) {
                    setPastSetPoints([...pastSetPoints, currentSetPoint])
                }
                if (currentMatchPoint && pastMatchPoints) {
                    setPastMatchPoints([...pastMatchPoints, currentMatchPoint])
                }

                // check for set/match point
                const setPointPlayer = checkForSetPoint(updatedSet, player1, player2)
                if (setPointPlayer && completedSets && matchType) {
                    const matchPointPlayer = checkForMatchPoint(
                        updatedSet,
                        setPointPlayer,
                        completedSets,
                        matchType,
                        player1,
                        player2
                    )
                    if (matchPointPlayer) {
                        setCurrentMatchPoint(matchPointPlayer)
                        setCurrentSetPoint(null)
                    } else {
                        setCurrentSetPoint(setPointPlayer)
                        setCurrentMatchPoint(null)
                    }
                } else {
                    setCurrentSetPoint(null)
                    setCurrentMatchPoint(null)
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
        setCurrentSetPoint(null)
        setCurrentMatchPoint(null)
    }

    const handleCloseMatch = () => {
        setDatabaseId(null)
        setMatchStatus(null)
        setMatchType(null)
        setMatchWinner(null)
        setPlayer1(null)
        setPlayer2(null)
        setInProgressSet(null)
        setCompletedSets(null)
        setCurrentSetPoint(null)
        setPastSetPoints(null)
        setCurrentMatchPoint(null)
        setPastMatchPoints(null)
    }

    const handleRematch = () => {
        if (matchType && player1 && player2) {
            const type = matchType
            const p1 = player1
            const p2 = player2
            handleNewMatch(type)
            handleInitMatch(p1, p2)
        }
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
        currentSetPoint,
        pastSetPoints,
        currentMatchPoint,
        pastMatchPoints,
        handleNewMatch,
        handleInitMatch,
        handleStartMatch,
        handlePoint,
        handleEndMatch,
        handleCloseMatch,
        handleRematch
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
