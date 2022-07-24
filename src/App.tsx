import React, { useState, useContext, useCallback, useEffect } from 'react';
import { SocketContext, SocketIDContext, socket } from "./context/socket";
import LobbyManager from './features/lobby/LobbyManager';
import SocketForm from './components/SocketForm';
import './App.css';

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
      {messageList.map((message, i) => <p key={i}>{message}</p>)}
    </React.Fragment>
  );
}

export default App;
