import { LobbyClient } from 'boardgame.io/client';
import { BoardProps } from 'boardgame.io/react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { validPlayerId } from '@card-engine-nx/basic';
import { createView, getActions } from '@card-engine-nx/engine';
import { State } from '@card-engine-nx/state';
import { GameDisplay } from '../3d/GameDisplay';
import { DetailProvider } from '../game/DetailContext';
import { StateContext } from '../game/StateContext';
import { useSettings } from '../settings/useSettings';
import { GAME_NAME } from './LobbyPage';

export type LotrLCGProps = BoardProps<State>;

export const LotrLCGBoard = (props: LotrLCGProps) => {
  const settings = useSettings();
  const navigate = useNavigate();
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
        leave: () => {
          if (props.isMultiplayer) {
            const lobby = new LobbyClient({ server: settings.value.serverUrl });

            if (props.playerID && props.credentials) {
              lobby.leaveMatch(GAME_NAME, props.matchID, {
                playerID: props.playerID,
                credentials: props.credentials,
              });
            }

            navigate('/lobby');
          } else {
            navigate('/single');
          }
        },
      }}
    >
      <DetailProvider>
        <GameDisplay />
      </DetailProvider>
    </StateContext.Provider>
  );
};
