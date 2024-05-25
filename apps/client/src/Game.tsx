import { GameSetupData } from '@card-engine-nx/engine';
import { rxEvents } from './GameDisplay';
import { LotrLCGClient } from './bgio/LotrLCGBoard';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { useSnackbar } from 'notistack';

export const Game = (props: {
  players: number;
  playerID?: string;
  multiplayer: boolean;
  server?: string;
  setup?: GameSetupData;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const Client = LotrLCGClient(
    rxEvents,
    props.players,
    props.multiplayer
      ? props.server
        ? SocketIO({ server: props.server })
        : Local({ persist: true })
      : undefined,
    props.setup,
    {
      debug(...message) {
        console.log(...message);
      },
      log(m) {
        enqueueSnackbar(m);
      },
      success(m) {
        enqueueSnackbar(m, { variant: 'success' });
      },
      warning(m) {
        enqueueSnackbar(m, { variant: 'warning' });
      },
      error(m) {
        enqueueSnackbar(m, { variant: 'error' });
      },
    }
  );

  const playerID = props.playerID ? props.playerID : '0';
  console.log('playerID', playerID);

  return <Client playerID={playerID} />;
};
