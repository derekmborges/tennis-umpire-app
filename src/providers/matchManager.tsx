/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMinutesBetweenDates } from "../lib/helpers";
import { checkForGameWin, checkForMatchPoint, checkForMatchWin, checkForSetPoint, checkForSetWin, checkForTiebreaker, checkForTiebreakSetWin } from "../lib/scoring";
import { Match, MatchStatus, MatchType, Player, Set } from "../lib/models/match";
import { COLLECTION_MATCHES, COLLECTION_USERS, useDatabase } from "./databaseProvider";
import { useAuth } from "./authProvider";
import { collection, onSnapshot, query } from "firebase/firestore";
import { database } from "../firebase";
import { matchConverter } from "../lib/converters";

interface MatchManagerContextT {
    loadingMatches: boolean
    matches: Match[] | null

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
    handleCloseMatch: () => void
    handleRematch: () => void
    handleLoadMatch: (match: Match) => void
}

export const MatchManagerContext = createContext<MatchManagerContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

export const MatchManagerProvider: React.FC<ProviderProps> = ({ children }) => {
    const { user } = useAuth()
    const userId =  user?.id || ''
    const [loadingMatches, setLoadingMatches] = useState<boolean>(false)
    const [matches, setMatches] = useState<Match[] | null>(null)

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
    const [matchTimerInterval, setMatchTimerInterval] = useState<NodeJS.Timer | undefined>();
    const [matchStartTime, setMatchStartTime] = useState<Date | null>(null)
    const [matchEndTime, setMatchEndTime] = useState<Date | null>(null)    
    const [matchTimerLabel, setMatchTimerLabel] = useState<string | null>(null);

    // Database stuff
    const [databaseId, setDatabaseId] = useState<string | null>(null)
    const { handleAddMatch: handleAdd, handleUpdateMatch: handleUpdate } = useDatabase()

    const matchesCollection = collection(database, COLLECTION_USERS, userId, COLLECTION_MATCHES).withConverter(matchConverter)

    useEffect(() => {
        setLoadingMatches(true)
        const unsubscribe = onSnapshot(query(matchesCollection), (querySnapshot) => {
            const matches: Match[] = []
            querySnapshot.forEach((doc) => {
                const match = doc.data()
                if (match) {
                    matches.push(match)
                }
            });
            setMatches(matches)
            setLoadingMatches(false)
        });
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const saveMatch = async () => {
        if (matchStatus && matchType && player1 && player2 && inProgressSet && completedSets
        ) {
            if (matchStatus === MatchStatus.PENDING_START && !databaseId) {
                const match: Match = {
                    type: matchType,
                    status: matchStatus,
                    player1,
                    player2,
                    inProgressSet,
                    completedSets
                }
                const createdMatch = await handleAdd(userId, match)
                if (createdMatch.id) {
                    setDatabaseId(createdMatch.id)
                }
            } else if (databaseId) {
                const matchUpdates: Match = {
                    id: databaseId,
                    type: matchType,
                    status: matchStatus,
                    player1,
                    player2,
                    inProgressSet,
                    completedSets,
                    ...(matchStartTime && {startTime: matchStartTime}),
                    ...(matchEndTime && {endTime: matchEndTime}),
                    ...(matchWinner && {winner: matchWinner}),
                }
                handleUpdate(userId, matchUpdates)
            }
        }
    }

    useEffect(() => {
        if (matchStatus && [MatchStatus.PENDING_START, MatchStatus.IN_PROGRESS, MatchStatus.COMPLETE].includes(matchStatus)) {
            saveMatch()
        }
    }, [matchStatus, inProgressSet, completedSets])

    const handleNewMatch = (type: MatchType) => {
        setDatabaseId(null)
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
        setMatchTimerLabel('00:00')

        setCurrentSetPoint(null)
        setCurrentMatchPoint(null)
        setPastSetPoints([])
        setPastMatchPoints([])

        createNewSet(player1, player2)
        setMatchStatus(MatchStatus.PENDING_START)
    }

    const updateTimer = () => {
        if (matchStartTime) {
            const minutes = getMinutesBetweenDates(matchStartTime, new Date())
            const hours = Math.floor(minutes / 60)
            const remainingMinutes = minutes % 60
            setMatchTimerLabel(
                `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
            )
        }
    }

    useEffect(() => {
        if (matchStartTime && !matchEndTime) {
            updateTimer()
            const interval = setInterval(updateTimer, 60000)
            setMatchTimerInterval(interval)
            return () => clearInterval(interval)
        } else {
            clearInterval(matchTimerInterval)
            setMatchTimerInterval(undefined)
        }
    }, [matchStartTime])

    useEffect(() => {
        if (matchEndTime) {
            clearInterval(matchTimerInterval)
        }
    }, [matchEndTime])

    const handleStartMatch = () => {
        setMatchStartTime(new Date())
        setMatchStatus(MatchStatus.IN_PROGRESS)
    }

    useEffect(() => {
        if (matchType && player1 && player2 && completedSets && completedSets.length > 1) {
            const winner = checkForMatchWin(completedSets, matchType, player1, player2)
            if (winner) {
                handleEndMatch(winner)
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

    const handleEndMatch = (winner: Player) => {
        setMatchWinner(winner)
        setMatchStatus(MatchStatus.COMPLETE)
        
        setMatchEndTime(new Date())
        
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

        setMatchTimerInterval(undefined)
        setMatchStartTime(null)
        setMatchEndTime(null)
        
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

    const handleLoadMatch = (match: Match) => {
        setMatchType(match.type)
        setMatchStatus(match.status)
        setPlayer1(match.player1)
        setPlayer2(match.player2)
        setInProgressSet(match.inProgressSet)
        setCompletedSets(match.completedSets)

        if (match.id) {
            setDatabaseId(match.id)
        }
        if (match.startTime) {
            setMatchStartTime(match.startTime)
        }
        if (match.endTime) {
            setMatchEndTime(match.endTime)
        }
        if (match.winner) {
            setMatchWinner(match.winner)
        }
    }

    const contextValue: MatchManagerContextT = {
        loadingMatches,
        matches,
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
        handleCloseMatch,
        handleRematch,
        handleLoadMatch
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
