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
    player1Score: number
    player2Score: number
    winner?: Player
}

export interface Set {
    player1GamesWon: number
    player2GamesWon: number
    winner?: Player
}
