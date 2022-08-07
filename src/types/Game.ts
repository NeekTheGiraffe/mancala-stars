import { Mancala } from "features/mancala/Mancala";

export default interface Game {
    playerMap: { [playerId: string]: number };
    board: Mancala.Board;
}