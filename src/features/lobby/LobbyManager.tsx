import { SocketContext, SocketIDContext } from '../../context/socket';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import Lobby from './Lobby';
import SocketForm from '../../components/SocketForm';
import LobbyInfo from './LobbyInfo';
import CreateLobbyButton from './CreateLobbyButton';

export default function LobbyManager() {
  const socket = useContext(SocketContext);
  const myId = useContext(SocketIDContext);
  const [lobby, setLobby] = useState<Lobby | null>(null);

  useEffect(() => {
    socket.on("createLobby:success", (lobby: Lobby) => setLobby(lobby));
    socket.on("joinLobby:success", (lobby: Lobby) => setLobby(lobby));
    socket.on("leaveLobby:success", () => setLobby(null));
    socket.on("lobbyUpdate", (lobby: Lobby) => setLobby(lobby));
  }, [socket]);

  const leaveLobby = useCallback(() => socket.emit("leaveLobby"), [socket]);
  const startGame = useCallback(() => socket.emit("startGame"), [socket]);

  //useEffect(() => console.log(lobby), [lobby]);

  if (lobby) return (
    <React.Fragment>
      <LobbyInfo lobby={lobby} />
      {lobby.size === lobby.capacity && myId === lobby.leaderId &&
        <button onClick={startGame}>Start game</button>}
      <button onClick={leaveLobby}>Leave</button>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <CreateLobbyButton />
      <SocketForm placeholder="Enter a lobby code" buttonText="Join"
        onSubmit={(socket, formValue) => socket.emit("joinLobby", formValue)} />
    </React.Fragment>
  );
}