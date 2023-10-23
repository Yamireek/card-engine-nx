import { Vector3 } from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { LotrDeck3d } from './LotrDeck3d';
import { LotrCardArea } from './LotrCardArea';
import { cardSize } from './Card3d';

const positions: Record<number, Vector3> = {
  '1': [-0.155, 0.39, 0],
  '2': [0, 0, 0],
  '3': [0, 0, 0],
  '4': [0, 0, 0],
};

export const GameAreas = (props: { playerCount: number }) => {
  const { state } = useContext(StateContext);

  const playerCount = props.playerCount;

  return (
    <group position={positions[playerCount]}>
      <LotrDeck3d zone="encounterDeck" position={[0.31, -0.2, 0]} />
      <LotrDeck3d zone="discardPile" position={[0.39, -0.2, 0]} />

      <LotrCardArea
        layout={{
          position: [0.144, -0.2],
          size: { width: 0.1, height: 0.1 },
        }}
        cards={state.zones.questArea.cards}
        orientation="landscape"
      />

      <LotrCardArea
        layout={{
          position: [0.23, -0.2],
          size: { width: cardSize.width + 0.01, height: 0.1 },
        }}
        cards={state.zones.activeLocation.cards}
      />

      <LotrCardArea
        layout={{
          position: [-0.1, -0.2],
          size: { width: 0.4, height: 0.1 },
          color: 'red',
        }}
        cards={state.zones.stagingArea.cards}
      />
    </group>
  );
};
