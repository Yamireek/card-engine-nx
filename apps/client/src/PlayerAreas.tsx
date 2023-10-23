import { Vector3 } from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { PlayerId } from '@card-engine-nx/basic';
import { LotrDeck3d } from './LotrDeck3d';
import { LotrCardArea } from './LotrCardArea';

const positions: Record<number, Partial<Record<PlayerId, Vector3>>> = {
  '1': { '0': [-0.155, 0.39, 0] },
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
        zone={{ player: props.player, type: 'library' }}
        position={[0.39, -0.4, 0]}
      />
      <LotrDeck3d
        zone={{ player: props.player, type: 'discardPile' }}
        position={[0.39, -0.5, 0]}
      />
      <LotrCardArea
        layout={{
          position: [0.025, -0.45],
          size: { width: 0.65, height: 0.2 },
          color: 'red',
        }}
        cards={playerState.zones.playerArea.cards}
      />
      <LotrCardArea
        layout={{
          position: [0.065, -0.3],
          size: { width: 0.73, height: 0.1 },
          color: 'red',
        }}
        cards={playerState.zones.engaged.cards}
      />
    </group>
  );
};
