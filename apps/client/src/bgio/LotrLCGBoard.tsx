import { LotrLCGame, UIEvents, createView } from '@card-engine-nx/engine';
import { State } from '@card-engine-nx/state';
import { BoardProps, Client } from 'boardgame.io/react';
import { GameSetup } from '../GameSetup';
import { StateContext } from '../StateContext';
import { useMemo } from 'react';
import { validPlayerId } from '@card-engine-nx/basic';
import { Debug } from 'boardgame.io/debug';
import { ClientOpts } from 'boardgame.io/dist/types/src/client/client';

export type LotrLCGProps = BoardProps<State>;

export const LotrLCGBoard = (props: LotrLCGProps) => {
  const view = useMemo(() => createView(props.G), [props.G]);

  return (
    <StateContext.Provider
      value={{
        state: props.G,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moves: props.moves as any,
        view,
        playerId: props.playerID ? validPlayerId(props.playerID) : undefined,
      }}
    >
      <GameSetup />
    </StateContext.Provider>
  );
};

export function LotrLCGClient(
  events: UIEvents,
  numPlayers: number,
  multiplayer?: ClientOpts['multiplayer']
) {
  return Client({
    game: LotrLCGame(events),
    board: LotrLCGBoard,
    numPlayers,
    multiplayer,
    debug: { collapseOnLoad: true, impl: Debug },
  });
}
