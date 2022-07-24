import { useContext, useCallback } from 'react';
import { SocketContext } from '../../context/socket';

export default function CreateLobbyButton() {
  const socket = useContext(SocketContext);
  const createLobby = useCallback(() => socket.emit('createLobby'), [socket]);

  return (<button onClick={createLobby}>Create lobby</button>);
}