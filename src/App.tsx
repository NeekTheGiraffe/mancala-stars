import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext, SocketIDContext, socket } from 'context/socket';
import SocketForm from 'components/SocketForm';
import 'App.css';
import Lobby from 'types/Lobby';
import LobbyInfo from 'features/lobby/LobbyInfo';
import CreateLobbyButton from 'features/lobby/CreateLobbyButton';
import MancalaBoardView from 'features/mancala/MancalaBoardView';
import Game from 'types/Game';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Content />
    </SocketContext.Provider>
  );
}

function Content() {

  const socket = useContext(SocketContext);
  const [myId, setMyId] = useState<string | null>(null);
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [isGameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('yourId', id => setMyId(id));
    socket.emit('requestId');

    socket.on("lobby:create:success", (lobby: Lobby) => setLobby(lobby));
    socket.on("lobby:join:success", (lobby: Lobby) => setLobby(lobby));
    socket.on("lobby:leave:success", () => setLobby(null));
    socket.on("lobby:update", (lobby: Lobby) => setLobby(lobby));

    socket.on("game:start", (game: Game) => {
      setGame(game);
      setGameOver(false);
    });
    socket.on("game:update", (game: Game, isGameOver: boolean) => {
      setGame(game);
      setGameOver(isGameOver);
    });
    socket.on("game:end", () => {
      setGame(null);
      setGameOver(false);
    });

  }, [socket]);

  const sendMessage = useCallback((socket: Socket, formValue: string) => socket.emit('sendMessage', formValue), []);
  const content = getContent(lobby, game);

  return (
    <SocketIDContext.Provider value={myId}>
      <div className="App">
        {content}

        <MessageList />
        <SocketForm placeholder="Write something..." buttonText="Send"
          onSubmit={sendMessage} />
      </div>
    </SocketIDContext.Provider>
  );
}

/** Returns the content prop appropriate for the current lobby/game state. */
function getContent(lobby: Lobby | null, game: Game | null) {
  if (lobby == null) return <NoLobbyContent />;
  if (game == null) return <LobbyContent lobby={lobby} />;
  return <GameContent game={game} />;
}

function NoLobbyContent() {
  const joinLobby = useCallback((socket: Socket, formValue: string) => socket.emit('lobby:join', formValue), []);

  return (
    <React.Fragment>
      <CreateLobbyButton />
      <SocketForm placeholder="Enter a lobby code" buttonText="Join"
        onSubmit={joinLobby} />
    </React.Fragment>
  );
}

function LobbyContent({ lobby }: { lobby: Lobby }) {
  const myId = useContext(SocketIDContext);
  const socket = useContext(SocketContext);
  const leaveLobby = useCallback(() => socket.emit("lobby:leave"), [socket]);
  const startGame = useCallback(() => socket.emit("game:start"), [socket]);

  return (
    <React.Fragment>
      <LobbyInfo lobby={lobby} />
      {lobby.size === lobby.capacity && myId === lobby.leaderId &&
        <button onClick={startGame}>Start game</button>}
      <button onClick={leaveLobby}>Leave</button>
    </React.Fragment>
  );
}

function GameContent({ game }: { game: Game }) {
  
  const myId = useContext(SocketIDContext);
  const myIndex = myId != null ? game.playerMap[myId] : 0;
  const myTurn = myIndex === game.board.whoseTurn;
  const flipPerspective = myIndex === 1;

  return (
    <React.Fragment>
      <h4>Opponent</h4>
      <MancalaBoardView board={game.board} flipPerspective={flipPerspective} />
      <h4>You</h4>
      <h3>{myTurn ? "Your" : "Opponent's"} Turn</h3>
    </React.Fragment>
  );
}

function MessageList() {

  const socket = useContext(SocketContext);
  const [messageList, setMessageList] = useState<string[]>([]);

  const addMessageToList = useCallback((message: string) => {
    setMessageList((prevMessageList: string[]) => prevMessageList.concat(message));
  }, []);

  useEffect(() => {
    socket.on("sendMessage", addMessageToList);
  }, [socket, addMessageToList]);

  return (
    <React.Fragment>
      {messageList.map((message, i) =>
        <p key={i}>{message}</p>
      )}
    </React.Fragment>
  );
}

export default App;
