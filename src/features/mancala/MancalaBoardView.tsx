import { useCallback, useContext } from 'react';
import { Mancala } from 'features/mancala/Mancala';
import { SocketContext } from 'context/socket';

export default function MancalaBoardView({ board, flipPerspective }:
  { board: Mancala.Board, flipPerspective: boolean }) {
  
  const { stores, pits, whoseTurn } = board;
  const theirIndex = flipPerspective ? 0 : 1;
  const myIndex = flipPerspective ? 1 : 0;
  const socket = useContext(SocketContext);
  const halfway = Mancala.NUM_PITS / 2;
  const makeMove = useCallback((pit: number) => socket.emit('game:makeMove', pit), [socket]);
  const pitValueToTableEl = useCallback((value: number, pit: number) => {
    const pitOwner = Math.floor(pit / halfway);
    if (value === 0 || whoseTurn !== myIndex || pitOwner === theirIndex) {
      return <td><button disabled>{value}</button></td>;
    }
    return <td><button onClick={() => makeMove(pit)}>{value}</button></td>;
    
  }, [makeMove, whoseTurn, myIndex, theirIndex, halfway]);
  const myPits = flipPerspective ?
    pits.slice(halfway).map((value, i) => pitValueToTableEl(value, i + halfway)) :
    pits.slice(0, halfway).map((value, i) => pitValueToTableEl(value, i));
  const theirPits = flipPerspective ? 
    pits.slice(0, halfway).reverse().map((value, i) => pitValueToTableEl(value, halfway - 1 - i)) :
    pits.slice(halfway).reverse().map((value, i) => pitValueToTableEl(value, Mancala.NUM_PITS - 1 - i))
    

  return (
    <table>
      <tr>
        <td rowSpan={2}>{stores[theirIndex]}</td>
        {theirPits}
        <td rowSpan={2}>{stores[myIndex]}</td>
      </tr>
      <tr>
        {myPits}
      </tr>
    </table>
  );
}