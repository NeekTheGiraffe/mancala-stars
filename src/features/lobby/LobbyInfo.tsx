import Lobby from 'types/Lobby';
import React, { useCallback, useState } from 'react';

interface LobbyInfoProps { lobby: Lobby }
export default function LobbyInfo({ lobby }: LobbyInfoProps) {
  const { id, size, capacity } = lobby;
  const [copied, setCopied] = useState(false);
  const copyLobbyId = useCallback(() => {
    navigator.clipboard.writeText(id);
    setCopied(true);
  }, [id]);

  return (
    <React.Fragment>
      <p>Lobby ({size}/{capacity})</p>
      <p>Code: {id}<button className="btn" onClick={copyLobbyId}>{copied ? 'COPIED!' : 'COPY CODE'}</button></p>
    </React.Fragment>
  );
}