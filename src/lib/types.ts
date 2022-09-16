export enum MatchType {
    MENS_SINGLE = "Men's Single",
    WOMENS_SINGLE = "Women's Single",
}

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

export interface Tiebreak {
    player1Score: number
    player2Score: number
}

export interface Set {
    currentGame: Game
    completedGames: Game[]
    tiebreak?: Tiebreak
    winner?: Player
}
