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
import { Mancala } from 'features/mancala/Mancala';

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
  const [soloBoard, setSoloBoard] = useState<Mancala.Board | null>(null);

  useEffect(() => {
    socket.on('yourId', id => setMyId(id));
    socket.emit('requestId');

    socket.on("lobby:create:success", (lobby: Lobby) => setLobby(lobby));
    socket.on("lobby:join:success", (lobby: Lobby) => setLobby(lobby));
    socket.on("lobby:leave:success", () => setLobby(null));
    socket.on("lobby:update", (lobby: Lobby) => setLobby(lobby));

    const setGameAndGameOver = (game: Game | null, gameOver: boolean) => {
      setGame(game);
      setGameOver(gameOver);
    };
    socket.on("game:start", game => setGameAndGameOver(game, false));
    socket.on("game:update", (game, isGameOver) => setGameAndGameOver(game, isGameOver));
    socket.on("game:end", () => setGameAndGameOver(null, false));

    const setBoardAndGameOver = (board: Mancala.Board | null, gameOver: boolean) => {
      setSoloBoard(board);
      setGameOver(gameOver);
    };
    socket.on("game:solo:start", board => setBoardAndGameOver(board, false));
    socket.on("game:solo:update", (board, gmOver) => setBoardAndGameOver(board, gmOver));

  }, [socket]);

  const sendMessage = useCallback((socket: Socket, formValue: string) => socket.emit('sendMessage', formValue), []);
  const content = getContent(lobby, game, soloBoard, isGameOver);

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
function getContent(lobby: Lobby | null, game: Game | null, soloBoard: Mancala.Board | null, isGameOver: boolean) {
  if (soloBoard != null) return <MancalaBoardView board={soloBoard} flipPerspective={false} solo={true} gameOver={isGameOver} />
  if (game != null) return <GameContent game={game} gameOver={isGameOver} />;
  if (lobby == null) return <NoLobbyContent />;
  return <LobbyContent lobby={lobby} />;
}

function NoLobbyContent() {
  const joinLobby = useCallback((socket: Socket, formValue: string) => socket.emit('lobby:join', formValue), []);
  
  const socket = useContext(SocketContext);
  const startSoloGame = useCallback(() => socket.emit('game:solo:start'), [socket]);

  return (
    <React.Fragment>
      <button onClick={startSoloGame}>Play vs. AI</button>
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

function GameContent({ game, gameOver }: { game: Game, gameOver: boolean }) {
  
  const myId = useContext(SocketIDContext);
  const myIndex = myId != null ? game.playerMap[myId] : 0;
  const myTurn = myIndex === game.board.whoseTurn;
  const flipPerspective = myIndex === 1;

  return (
    <React.Fragment>
      <h4>Opponent</h4>
      <MancalaBoardView board={game.board} flipPerspective={flipPerspective} gameOver={gameOver} />
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
