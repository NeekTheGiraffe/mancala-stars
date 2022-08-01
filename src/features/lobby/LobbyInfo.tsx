import Lobby from '../../types/Lobby';
import React from 'react';

interface LobbyInfoProps { lobby: Lobby }
export default function LobbyInfo({ lobby }: LobbyInfoProps) {
  const { id, game, size, capacity } = lobby;
  return (
    <React.Fragment>
      <p>Lobby: {id} ({game})</p>
      <p>Players: {size}/{capacity}</p>
    </React.Fragment>
  );
}