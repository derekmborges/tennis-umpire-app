import { GameScore, Game, Set, Player, MatchType, matchTypeWinningSetCount, Tiebreak } from "./types"

const getGameWinner = (game: Game, player1: Player, player2: Player): Player | undefined => {
    if (game.player1Score > GameScore.FOURTY && (game.player1Score - game.player2Score) >= 2) {
        return player1
    } else if (game.player2Score > GameScore.FOURTY && (game.player2Score - game.player1Score) >= 2) {
        return player2
    }
}

export const checkForGameWin = (set: Set, player1: Player, player2: Player): Set => {
    const game = set.currentGame
    const gameWinner = getGameWinner(game, player1, player2)
    if (gameWinner) {
        game.winner = gameWinner
        const newGame: Game = {
            server: game.server.name === player1.name ? player2 : player1,
            player1Score: 0,
            player2Score: 0
        }
        return {
            ...set,
            currentGame: newGame,
            completedGames: [...set.completedGames, game]
        }
    } else {
        return {
            ...set,
            currentGame: game
        }
    }
}

export const checkForTiebreaker = (set: Set, player1: Player, player2: Player): Set => {
    if (set.completedGames.length === 12) {
        const lastServer = set.completedGames[11].server
        return {
            ...set,
            tiebreak: {
                player1Score: 0,
                player2Score: 0,
                currentServer: lastServer.name === player1.name ? player2 : player1
            }
        }
    }
    return set
}

const getSetWinner = (completedGames: Game[], player1: Player, player2: Player): Player | undefined => {
    const player1Games = completedGames.filter(g => g.winner?.name === player1.name).length
    const player2Games = completedGames.filter(g => g.winner?.name === player2.name).length
    if ((player1Games >= 6 && (player1Games - player2Games) >= 2)) {
        return player1
    } else if (player2Games >= 6 && (player2Games - player1Games) >= 2) {
        return player2
    }
}

const getTiebreakWinner = (tiebreak: Tiebreak, player1: Player, player2: Player): Player | undefined => {
    const player1Score = tiebreak.player1Score
    const player2Score = tiebreak.player2Score
    if (player1Score >= 7 && (player1Score - player2Score) >= 2) {
        return player1
    } else if (player2Score >= 7 && (player2Score - player1Score) >= 2) {
        return player2
    }
}

export const checkForSetPoint = (set: Set, player1: Player, player2: Player): Player | undefined => {
    // Only check if enough games have been played
    if (!set.winner && !set.tiebreak && set.completedGames.length >= 5) {

        // simulate player1 getting another point
        const player1Score = set.currentGame.player1Score + 1
        const possibleGame1 = { ...set.currentGame, player1Score }
        const possibleWinner1 = getGameWinner(possibleGame1, player1, player2)
        if (possibleWinner1) {
            possibleGame1.winner = possibleWinner1
            const possibleCompletedGames = [...set.completedGames, possibleGame1]
            const possibleSetWinner = getSetWinner(possibleCompletedGames, player1, player2)
            if (possibleSetWinner) {
                return player1
            }
        }

        // simulate player2 getting another point
        const player2Score = set.currentGame.player2Score + 1
        const possibleGame2 = { ...set.currentGame, player2Score }
        const possibleWinner2 = getGameWinner(possibleGame2, player1, player2)
        if (possibleWinner2) {
            possibleGame2.winner = possibleWinner2
            const possibleCompletedGames2 = [...set.completedGames, possibleGame2]
            const possibleSetWinner2 = getSetWinner(possibleCompletedGames2, player1, player2)
            if (possibleSetWinner2) {
                return player2
            }
        }
    }
    // Simulate tiebreak
    else if (!set.winner && set.tiebreak) {
        const player1Score = set.tiebreak.player1Score + 1
        const possibleTiebreakWinner1 = getTiebreakWinner({...set.tiebreak, player1Score}, player1, player2)
        if (possibleTiebreakWinner1) {
            return player1
        }

        const player2Score = set.tiebreak.player1Score + 1
        const possibleTiebreakWinner2 = getTiebreakWinner({...set.tiebreak, player2Score}, player1, player2)
        if (possibleTiebreakWinner2) {
            return player2
        }
    }
}

export const checkForSetWin = (set: Set, player1: Player, player2: Player): Set => {
    const setWinner = getSetWinner(set.completedGames, player1, player2)
    if (setWinner) {
        return {
            ...set,
            winner: setWinner
        }
    }
    return set
}

export const checkForTiebreakSetWin = (set: Set, player1: Player, player2: Player): Set => {
    if (set.tiebreak) {
        const tiebreakWinner = getTiebreakWinner(set.tiebreak, player1, player2)
        if (tiebreakWinner) {
            return {
                ...set,
                winner: tiebreakWinner
            }
        }
    }
    return set
}

export const getMatchWinner = (completedSets: Set[], matchType: MatchType, player1: Player, player2: Player): Player | undefined => {
    const setsRequired = matchTypeWinningSetCount.get(matchType)
    if (setsRequired) {
        const player1Sets = completedSets.filter(s => s.winner?.name === player1.name).length
        const player2Sets = completedSets.filter(s => s.winner?.name === player2.name).length
        if (player1Sets === setsRequired) {
            return player1
        } else if (player2Sets === setsRequired) {
            return player2
        }
    }
}

export const checkForMatchWin = (completedSets: Set[], matchType: MatchType, player1: Player, player2: Player): Player | undefined => {
    return getMatchWinner(completedSets, matchType, player1, player2)
}

export const checkForMatchPoint = (
    set: Set,
    simulatedSetWinner: Player,
    completedSets: Set[],
    matchType: MatchType,
    player1: Player,
    player2: Player
    ): Player | undefined => {
    return getMatchWinner(
        [...completedSets, { ...set, winner: simulatedSetWinner }],
        matchType,
        player1,
        player2
    )
}
