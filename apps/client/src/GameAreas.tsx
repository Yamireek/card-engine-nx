import {
  Vector3,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { LotrDeck3d } from './LotrDeck3d';
import { LotrCardArea } from './LotrCardArea';

const positions: Record<number, Vector3> = {
  '1': [0, 0, 0],
  '2': [0, 0, 0],
  '3': [0, 0, 0],
  '4': [0, 0, 0],
};

export const GameAreas = (props: { playerCount: number }) => {
  const { state } = useContext(StateContext);

  const playerCount = props.playerCount;

  return (
    <group position={positions[playerCount]}>
      <LotrDeck3d
        zone={{ owner: 'game', type: 'encounterDeck' }}
        position={[0.35, 0.4, 0]}
      />
      <LotrDeck3d
        zone={{ owner: 'game', type: 'discardPile' }}
        position={[0.45, 0.4, 0]}
      />

      <LotrCardArea
        layout={{
          color: 'gold',
          position: [0.2, 0.45],
          size: { width: 0.2, height: 0.1 },
        }}
        cards={state.zones.questArea.cards}
      />

      <LotrCardArea
        layout={{
          color: 'purple',
          position: [-0.2, 0.4],
          size: { width: 0.6, height: 0.2 },
        }}
        cards={state.zones.stagingArea.cards}
      />

      <LotrCardArea
        layout={{
          color: 'green',
          position: [0.2, 0.35],
          size: { width: 0.2, height: 0.1 },
        }}
        cards={state.zones.activeLocation.cards}
      />
    </group>
  );
};
