import { rxEvents } from './GameDisplay';
import { LotrLCGClient } from './bgio/LotrLCGClient';
import { useSnackbar } from 'notistack';
import { SetupParams } from './App';

export const Game = (props: { setup: SetupParams }) => {
  const { enqueueSnackbar } = useSnackbar();

  const Client = LotrLCGClient(rxEvents, props.setup, {
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
  });

  if (props.setup.type === 'join') {
    return (
      <Client
        matchID={props.setup.matchID}
        playerID={props.setup.playerID}
        credentials={props.setup.credentials}
      />
    );
  }

  return <Client playerID="0" />;
};
