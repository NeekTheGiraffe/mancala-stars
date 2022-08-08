import Lobby from "types/Lobby";
import Game from "types/Game";

export interface ClientToServerEvents {
    "sendMessage": (m: string) => void;

    "lobby:create": () => void;
    "lobby:join": (lobbyId: string) => void;
    "lobby:leave": () => void;
    
    "game:start": () => void;
    "game:makeMove": (pit: number) => void;

    "requestId": () => void;
}

export interface ServerToClientEvents {
    "sendMessage": (m: string) => void;

    "lobby:create:success": (lobby: Lobby) => void;
    "lobby:join:success": (lobby: Lobby) => void;
    "lobby:leave:success": () => void;
    "lobby:update": (lobby: Lobby) => void;

    "game:start": (game: Game) => void;
    "game:update": (game: Game, isGameOver: boolean) => void;
    "game:end": () => void;

    "yourId": (socketId: string) => void;
}