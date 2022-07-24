import React, { useState, useContext, useCallback, useEffect } from 'react';
import { SocketContext, SocketIDContext, socket } from "./context/socket";
import { Lobby } from './features/lobby/Lobby';
import './App.css';
import { Socket } from 'socket.io-client';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <GlobalDataHandler />
    </SocketContext.Provider>
  );
}
function GlobalDataHandler() {

  const socket = useContext(SocketContext);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    socket.on('yourId', id => setMyId(id));
    socket.emit('requestId');
  }, [socket]);

  return (
    <SocketIDContext.Provider value={myId}>
      <div className="App">
        <LobbyManager />  
        <MessageList />
        <SocketForm placeholder="Write something..." buttonText="Send"
          onSubmit={(socket, formValue) => socket.emit("sendMessage", formValue)} />
      </div>
    </SocketIDContext.Provider>
  );
}

function LobbyManager() {
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

  useEffect(() => console.log(lobby), [lobby]);

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

interface LobbyInfoProps { lobby: Lobby }
function LobbyInfo({ lobby }: LobbyInfoProps) {
  return (
    <React.Fragment>
      <p>Lobby: {lobby.id} ({lobby.game})</p>
      <p>Players: {lobby.size}/{lobby.capacity}</p>
    </React.Fragment>
  );
}

function CreateLobbyButton() {
  const socket = useContext(SocketContext);
  const createLobby = useCallback(() => socket.emit('createLobby'), [socket]);

  return (<button onClick={createLobby}>Create lobby</button>);
}

function MessageList() {

  const socket = useContext(SocketContext);
  const [messageList, setMessageList] = useState<string[]>([]);

  const addMessageToList = useCallback((message: string) => {
    setMessageList((messageList: string[]) => messageList.concat(message));
  }, []);

  useEffect(() => {
    socket.on("sendMessage", addMessageToList);
  }, [addMessageToList, socket]);

  return (
    <React.Fragment>
      {messageList.map((message, i) => <p key={i}>{message}</p>)}
    </React.Fragment>
  );
}

interface SocketFormProps {
  onSubmit: (socket: Socket, formValue: string) => void
  placeholder: string,
  buttonText: string
}
function SocketForm({ onSubmit, placeholder, buttonText }: SocketFormProps) {
  const socket = useContext(SocketContext);
  const [formValue, setFormValue] = useState('');
  const sendMessage = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(socket, formValue);
    setFormValue('');
  }, [formValue, socket, onSubmit]);
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value),
    []);

  return (
    <form onSubmit={sendMessage}>
      <input value={formValue}
        placeholder={placeholder}
        onChange={onInputChange} />
      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default App;
