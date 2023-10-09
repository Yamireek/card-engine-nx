import { Vector3 } from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { PlayerId } from '@card-engine-nx/basic';
import { LotrDeck3d } from './LotrDeck3d';
import { LotrCardArea } from './LotrCardArea';

const positions: Record<number, Partial<Record<PlayerId, Vector3>>> = {
  '1': { '0': [0, 0.25, 0] },
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
        position={[0.39, -0.45, 0]}
      />
      <LotrDeck3d
        zone={{ player: props.player, type: 'discardPile' }}
        position={[0.46, -0.45, 0]}
      />
      <LotrCardArea
        layout={{
          color: 'blue',
          position: [-0.075, -0.45],
          size: { width: 0.85, height: 0.1 },
        }}
        cards={playerState.zones.hand.cards}
      />
      <LotrCardArea
        layout={{
          color: 'green',
          position: [0, -0.325],
          size: { width: 1, height: 0.15 },
        }}
        cards={playerState.zones.playerArea.cards}
      />
      <LotrCardArea
        layout={{
          color: 'red',
          position: [0, -0.175],
          size: { width: 1, height: 0.15 },
        }}
        cards={playerState.zones.engaged.cards}
      />
    </group>
  );
};
