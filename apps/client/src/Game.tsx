import { rxEvents } from './GameDisplay';
import { LotrLCGClient } from './bgio/LotrLCGBoard';
import { Local, SocketIO } from 'boardgame.io/multiplayer';

export const Game = (props: {
  players: number;
  playerID?: string;
  multiplayer: boolean;
  server?: string;
}) => {
  const Client = LotrLCGClient(
    rxEvents,
    props.players,
    props.multiplayer
      ? props.server
        ? SocketIO({ server: props.server })
        : Local({ persist: true })
      : undefined
  );

  const playerID = props.playerID ? props.playerID : '0';
  console.log('playerID', playerID);

  return <Client playerID={playerID} />;
};
