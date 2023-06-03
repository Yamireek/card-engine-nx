import { image, getCardImageUrl, Vector3 } from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { CardState } from '@card-engine-nx/state';
import { Deck3d } from './Deck3d';
import { Textures } from './types';

export const positions: Record<number, Partial<Record<PlayerId, Vector3>>> = {
  '1': { A: [0, 0, 0] },
  '2': { A: [0.5, 0, 0], B: [-0.5, 0, 0] },
  '3': { A: [0.5, -0.4, 0], B: [-0.5, -0.4, 0], C: [0, 0.4, 0] },
  '4': {
    A: [0.5, -0.4, 0],
    B: [-0.5, -0.4, 0],
    C: [0.5, 0.4, 0],
    D: [-0.5, 0.4, 0],
  },
};

export const rotations: Record<number, Partial<Record<PlayerId, number>>> = {
  '1': { A: 0 },
  '2': { A: 0, B: 0 },
  '3': { A: 0, B: 0, C: Math.PI },
  '4': { A: 0, B: 0, C: Math.PI, D: Math.PI },
};

export const PlayerAreas = (props: {
  player: PlayerId;
  textures: Textures;
  hiddenCards: CardId[];
}) => {
  const { state } = useContext(StateContext);
  const playerState = state.players[props.player];

  const cardRenderer: CardAreaLayoutProps<CardState>['renderer'] = (p) => {
    return (
      <Card3d
        key={p.item.id}
        id={p.item.id}
        name={`card-${p.item.id}`}
        size={{
          width: p.size.width / 1.2,
          height: p.size.height / 1.2,
        }}
        position={[p.position[0], p.position[1], 0.001]}
        textures={{
          front:
            props.textures[getCardImageUrl(p.item.definition.front, 'front')],
          back: props.textures[getCardImageUrl(p.item.definition.back, 'back')],
        }}
        hidden={props.hiddenCards.includes(p.item.id)}
      />
    );
  };

  if (!playerState) {
    return null;
  }

  const playerCount = Object.keys(state.players).length;

  return (
    <group
      position={positions[playerCount][props.player]}
      rotation={[0, 0, rotations[playerCount][props.player] ?? 0]}
    >
      <Deck3d
        owner={props.player}
        type="library"
        position={[0.35, -0.4, 0]}
        cardCount={playerState.zones.library.cards.length}
        texture={props.textures[image.playerBack]}
      />
      <Deck3d
        owner={props.player}
        type="discardPile"
        position={[0.45, -0.4, 0]}
        cardCount={playerState.zones.discardPile.cards.length}
        texture={props.textures[image.playerBack]}
      />
      <CardAreaLayout
        color="blue"
        position={[-0.1, -0.4]}
        size={{ width: 0.8, height: 0.2 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={playerState.zones.hand.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
      <CardAreaLayout
        color="green"
        position={[0, -0.15]}
        size={{ width: 1, height: 0.3 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={playerState.zones.playerArea.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
      <CardAreaLayout
        color="red"
        position={[0, 0.15]}
        size={{ width: 1, height: 0.3 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={playerState.zones.engaged.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
    </group>
  );
};
