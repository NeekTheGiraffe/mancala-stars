import React, { useState, useContext, useCallback, useEffect } from 'react';
import { SocketContext, socket } from "./context/socket";
import './App.css';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <MessageList />
      <ChatForm />
    </SocketContext.Provider>
  );
}

function MessageList() {

  const socket = useContext(SocketContext);
  const [messageList, setMessageList] = useState<string[]>([]);
  const addMessageToList = useCallback((message: string) => {
    setMessageList((messageList: string[]) => messageList.concat(message));
  }, []);
  useEffect(() => {
    console.log('useEffect');
    socket.on("sendMessage", addMessageToList);
  }, [addMessageToList, socket]);
  return (
    <React.Fragment>
      {messageList.map((message, i) => <p key={i}>{message}</p>)}
    </React.Fragment>
  );
}

function ChatForm() {
  
  const socket = useContext(SocketContext);
  const [formValue, setFormValue] = useState('');
  const sendMessage = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socket.emit("sendMessage", formValue);
    setFormValue('');
  }, [formValue, socket]);
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value),
    []);

  return (
    <form onSubmit={sendMessage}>
      <input value={formValue}
        placeholder="Write something..."
        onChange={onInputChange} />
      <button type="submit">Send</button>
    </form>
  );
}

export default App;
