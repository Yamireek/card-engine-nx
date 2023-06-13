import { Vector3 } from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { PlayerId } from '@card-engine-nx/basic';
import { LotrDeck3d } from './LotrDeck3d';
import { LotrCardArea } from './LotrCardArea';

const positions: Record<number, Partial<Record<PlayerId, Vector3>>> = {
  '1': { '0': [0, 0, 0] },
  '2': { '0': [0.5, 0, 0], '1': [-0.5, 0, 0] },
  '3': { '0': [0.5, -0.4, 0], '1': [-0.5, -0.4, 0], '2': [0, 0.4, 0] },
  '4': {
    '0': [0.5, -0.4, 0],
    '1': [-0.5, -0.4, 0],
    '2': [0.5, 0.4, 0],
    '3': [-0.5, 0.4, 0],
  },
};

const rotations: Record<number, Partial<Record<PlayerId, number>>> = {
  '1': { '0': 0 },
  '2': { '0': 0, '1': 0 },
  '3': { '0': 0, '1': 0, '2': Math.PI },
  '4': { '0': 0, '1': 0, '2': Math.PI, '3': Math.PI },
};

export const PlayerAreas = (props: { player: PlayerId }) => {
  const { state } = useContext(StateContext);

  const playerState = state.players[props.player];

  if (!playerState) {
    return null;
  }

  const playerCount = Object.keys(state.players).length;

  return (
    <group
      position={positions[playerCount][props.player]}
      rotation={[0, 0, rotations[playerCount][props.player] ?? 0]}
    >
      <LotrDeck3d
        zone={{ owner: props.player, type: 'library' }}
        position={[0.35, -0.4, 0]}
      />
      <LotrDeck3d
        zone={{ owner: props.player, type: 'discardPile' }}
        position={[0.45, -0.4, 0]}
      />
      <LotrCardArea
        layout={{
          color: 'blue',
          position: [-0.1, -0.4],
          size: { width: 0.8, height: 0.2 },
        }}
        cards={playerState.zones.hand.cards}
      />
      <LotrCardArea
        layout={{
          color: 'green',
          position: [0, -0.15],
          size: { width: 1, height: 0.3 },
        }}
        cards={playerState.zones.playerArea.cards}
      />
      <LotrCardArea
        layout={{
          color: 'red',
          position: [0, 0.15],
          size: { width: 1, height: 0.3 },
        }}
        cards={playerState.zones.engaged.cards}
      />
    </group>
  );
};
