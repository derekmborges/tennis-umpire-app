import { GameScore, Game, Set, Player, MatchType, matchTypeWinningSetCount } from "./types"

export const checkForGameWin = (set: Set, player1: Player, player2: Player): Set => {
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
    const player1Games = set.completedGames.filter(g => g.winner?.name === player1.name).length
    const player2Games = set.completedGames.filter(g => g.winner?.name === player2.name).length
    if (player1Games === 6 && player2Games === 6) {
        return {
            ...set,
            tiebreak: {
                player1Score: 0,
                player2Score: 0
            }
        }
    }
    return set
}

export const checkForSetWin = (set: Set, player1: Player, player2: Player): Set => {
    if (!set.tiebreak) {
        const player1Games = set.completedGames.filter(g => g.winner?.name === player1.name).length
        const player2Games = set.completedGames.filter(g => g.winner?.name === player2.name).length
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
    return set
}

export const checkForMatchWin = (completedSets: Set[], matchType: MatchType, player1: Player, player2: Player): Player | undefined => {
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
