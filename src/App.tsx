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

  //const sendMessage = useCallback((socket: Socket, formValue: string) => socket.emit('sendMessage', formValue), []);
  const quitSoloGame = useCallback(() => setSoloBoard(null), []);
  const content = getContent({ lobby, game, soloBoard, isGameOver, quitSoloGame });

  return (
    <SocketIDContext.Provider value={myId}>
      <div className="app">
        <h1>Mancala Stars</h1>

        {content}

        {/* <MessageList />
        <SocketForm placeholder="Write something..." buttonText="Send"
          onSubmit={sendMessage} /> */}
      </div>
    </SocketIDContext.Provider>
  );
}

/** Returns the content prop appropriate for the current lobby/game state. */
function getContent({ lobby, game, soloBoard, isGameOver, quitSoloGame }: {
  lobby: Lobby | null,
  game: Game | null,
  soloBoard: Mancala.Board | null,
  isGameOver: boolean,
  quitSoloGame: () => void;
}) {  
  if (soloBoard != null) return (<React.Fragment>
    <h2>Solo Game</h2>
    <button className="btn" onClick={quitSoloGame}>QUIT</button>
    <MancalaBoardView
      board={soloBoard}
      flipPerspective={false}
      solo={true}
      gameOver={isGameOver}
    />
  </React.Fragment>);
  if (lobby == null) return <NoLobbyContent />;
  if (game != null) return <GameContent game={game} gameOver={isGameOver} lobby={lobby} />;
  return <LobbyContent lobby={lobby} />;
}

function NoLobbyContent() {
  const joinLobby = useCallback((socket: Socket, formValue: string) => socket.emit('lobby:join', formValue), []);
  
  const socket = useContext(SocketContext);
  const startSoloGame = useCallback(() => socket.emit('game:solo:start'), [socket]);

  return (
    <React.Fragment>
      <div>
        <button className="btn" onClick={startSoloGame}>PLAY vs. AI</button>
        <CreateLobbyButton />
      </div>
      <SocketForm placeholder="Enter a lobby code" buttonText="JOIN"
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
      <div>
        {lobby.size === lobby.capacity && myId === lobby.leaderId &&
          <button className="btn" onClick={startGame}>START GAME</button>}
        <button className="btn" onClick={leaveLobby}>LEAVE</button>
      </div>
    </React.Fragment>
  );
}

function GameContent({ game, gameOver, lobby }: { game: Game, gameOver: boolean, lobby: Lobby }) {
  
  const myId = useContext(SocketIDContext);
  const myIndex = myId != null ? game.playerMap[myId] : 0;
  const flipPerspective = myIndex === 1;

  const socket = useContext(SocketContext);
  const restartGame = useCallback(() => socket.emit('game:start'), [socket]);
  const quitGame = useCallback(() => socket.emit('lobby:leave'), [socket]);
  const isLeader = myId === lobby.leaderId;

  const message = mancalaMessage(gameOver, myIndex, game.board.whoseTurn, game.board.stores);

  return (
    <React.Fragment>
      <h2>Online Game</h2>
      <div>
        {gameOver && isLeader && <button className="btn" onClick={restartGame}>RESTART</button>}
        {gameOver && <button className="btn" onClick={quitGame}>QUIT</button>}
      </div>
      <MancalaBoardView board={game.board} flipPerspective={flipPerspective} gameOver={gameOver} />
      <h3>{message}</h3>
    </React.Fragment>
  );
}

function mancalaMessage(gameOver: boolean, myIndex: number, whoseTurn: number, stores: number[]) {
  const [yourStore, opponentStore] = myIndex === 0 ? [stores[0], stores[1]] : [stores[1], stores[0]];
  if (gameOver) {
    if (yourStore > opponentStore) return 'You win!';
    if (yourStore < opponentStore) return 'Opponent wins!';
    return 'Tie!';
  }
  if (myIndex === whoseTurn) return 'Your turn';
  return 'Opponent\'s turn';
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
