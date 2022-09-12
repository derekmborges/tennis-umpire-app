export enum MatchStatus {
    CLOSED,
    CREATING,
    IN_PROGRESS,
    COMPLETE
}

export enum PlayerGender {
    MALE,
    FEMALE
}

export interface Player {
    name: string
    country: string
    gender: PlayerGender
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
