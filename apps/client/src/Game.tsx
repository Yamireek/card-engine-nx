import { GameSetupData } from '@card-engine-nx/engine';
import { rxEvents } from './GameDisplay';
import { LotrLCGClient } from './bgio/LotrLCGBoard';
import { Local, SocketIO } from 'boardgame.io/multiplayer';

export const Game = (props: {
  players: number;
  playerID?: string;
  multiplayer: boolean;
  server?: string;
  setup?: GameSetupData;
}) => {
  const Client = LotrLCGClient(
    rxEvents,
    props.players,
    props.multiplayer
      ? props.server
        ? SocketIO({ server: props.server })
        : Local({ persist: true })
      : undefined,
    props.setup
  );

  const playerID = props.playerID ? props.playerID : '0';
  console.log('playerID', playerID);

  return <Client playerID={playerID} />;
};
