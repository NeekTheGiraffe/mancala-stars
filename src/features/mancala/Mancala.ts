export namespace Mancala {

    export const NUM_PITS = 12;

    /*
            |       pits        |
    store 1 | 11 10  9  8  7  6 | store 0
            |  0  1  2  3  4  5 |
    */
    export interface Board {
        /** `stores[0]` is Player 1's store, `stores[1]` is Player 2's. */
        stores: number[],
        /** The first 6 entries represent the pits on Player 1's side.
         * The next 6 entries represent the pits on Player 2's side.
         */
        pits: number[],
        /** This number will be 0 or 1 */
        whoseTurn: number
    }
}