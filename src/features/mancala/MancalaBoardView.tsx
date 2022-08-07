import { useCallback } from 'react';
import { Mancala } from 'features/mancala/Mancala';

export default function MancalaBoardView({ board, flipPerspective }:
  { board: Mancala.Board, flipPerspective: boolean }) {

  const { stores, pits } = board;
  const theirIndex = flipPerspective ? 0 : 1;
  const myIndex = flipPerspective ? 1 : 0;
  const pitValueToButton = useCallback((pit: number) => <button>{pit}</button>, []);

  return (
    <table>
      <tr>
        <td rowSpan={2}>{stores[theirIndex]}</td>
        {pits.slice(Mancala.NUM_PITS / 2).reverse().map(pitValueToButton)}
        <td rowSpan={2}>{stores[myIndex]}</td>
      </tr>
      <tr>
        {pits.slice(0, Mancala.NUM_PITS / 2).map(pitValueToButton)}
      </tr>
    </table>
  );
}