export enum MatchType {
    MENS = "Men's",
    WOMENS = "Women's",
}

export const matchTypeWinningSetCount = new Map<MatchType, number>([
    [MatchType.MENS, 3],
    [MatchType.WOMENS, 2]
])

export enum MatchStatus {
    CREATING,
    PENDING_START,
    IN_PROGRESS,
    COMPLETE
}

export interface Player {
    name: string
    country: string
    rank?: number
}

export interface Game {
    server: Player
    player1Score: number
    player2Score: number
    winner?: Player
}

export enum GameScore {
    ZERO = 0,
    FIFTEEN = 1,
    THIRTY = 2,
    FOURTY = 3
}

export interface Tiebreak {
    player1Score: number
    player2Score: number
    currentServer: Player
}

export interface Set {
    currentGame: Game
    completedGames: Game[]
    tiebreak?: Tiebreak
    winner?: Player
}
