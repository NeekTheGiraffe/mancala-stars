import Lobby from "./Lobby";

export interface ClientToServerEvents {
    "sendMessage": (m: string) => void;
    "createLobby": () => void;
    "joinLobby": (lobbyId: string) => void;
    "leaveLobby": () => void;
    "requestId": () => void;
    "startGame": () => void;
}

export interface ServerToClientEvents {
    "sendMessage": (m: string) => void;
    "createLobby:success": (lobby: Lobby) => void;
    "joinLobby:success": (lobby: Lobby) => void;
    "leaveLobby:success": () => void;
    "lobbyUpdate": (lobby: Lobby) => void;
    "yourId": (socketId: string) => void;
}