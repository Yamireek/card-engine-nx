import {
  LotrLCGame,
  UIEvents,
  consoleEvents,
  createView,
} from '@card-engine-nx/engine';
import { State } from '@card-engine-nx/state';
import { BoardProps, Client } from 'boardgame.io/react';
import { GameDisplay, GameSetup } from '../GameDisplay';
import { StateContext } from '../StateContext';
import { useMemo } from 'react';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import './styles.css';

export type LotrLCGProps = BoardProps<State>;

export const LotrLCGBoard = (props: LotrLCGProps) => {
  const view = useMemo(() => createView(props.G), [props.G]);
  return (
    <StateContext.Provider
      value={{
        state: props.G,
        moves: props.moves as any,
        view,
        events: consoleEvents,
        playerId: props.playerID as any,
      }}
    >
      <GameSetup />
    </StateContext.Provider>
  );
};

export function LotrLCGClient(events: UIEvents) {
  return Client({
    game: LotrLCGame(events),
    board: LotrLCGBoard,
    numPlayers: 1,
    //multiplayer: SocketIO({ server: 'localhost:3000' }),
    multiplayer: Local(),
  });
}
