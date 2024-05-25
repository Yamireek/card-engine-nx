import {
  GameSetupData,
  Logger,
  LotrLCGame,
  UIEvents,
  createView,
  getActions,
} from '@card-engine-nx/engine';
import { State } from '@card-engine-nx/state';
import { BoardProps, Client } from 'boardgame.io/react';
import { StateContext } from '../StateContext';
import { useEffect, useMemo } from 'react';
import { validPlayerId } from '@card-engine-nx/basic';
import { Debug } from 'boardgame.io/debug';
import { ClientOpts } from 'boardgame.io/dist/types/src/client/client';
import { GameSetup } from '../GameSetup';

export type LotrLCGProps = BoardProps<State>;

export const LotrLCGBoard = (props: LotrLCGProps) => {
  const view = useMemo(() => createView(props.G), [props.G]);
  const actions = useMemo(() => getActions(props.G, view), [props.G, view]);

  useEffect(() => {
    const value = localStorage.getItem('saved_state');
    if (!value) {
      return;
    }
    try {
      const loaded = JSON.parse(value);
      props.moves.load(loaded);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StateContext.Provider
      value={{
        state: props.G,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moves: props.moves as any,
        view,
        playerId:
          props.isMultiplayer && props.playerID
            ? validPlayerId(props.playerID)
            : undefined,
        undo: props.undo,
        redo: props.redo,
        actions,
      }}
    >
      <GameSetup />
    </StateContext.Provider>
  );
};

export function LotrLCGClient(
  events: UIEvents,
  numPlayers: number,
  multiplayer?: ClientOpts['multiplayer'],
  setup?: GameSetupData,
  logger?: Logger
) {
  return Client({
    game: LotrLCGame(events, setup, logger),
    board: LotrLCGBoard,
    numPlayers,
    multiplayer,
    debug: { collapseOnLoad: true, impl: Debug },
  });
}
