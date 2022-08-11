import { useContext, useCallback } from 'react';
import { SocketContext } from '../../context/socket';

export default function CreateLobbyButton() {
  const socket = useContext(SocketContext);
  const createLobby = useCallback(() => socket.emit('lobby:create'), [socket]);

  return (<button onClick={createLobby}>CREATE LOBBY</button>);
}