export interface Lobby {
    id: string,
    leaderId: string,
    game: string,
    size: number,
    capacity: number,
    players: {
        [playerId: string]: string
    }
}