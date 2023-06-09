import {
  image,
  getCardImageUrl,
  Vector3,
  useTextures,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { CardState } from '@card-engine-nx/state';
import { Deck3d } from './Deck3d';
import { Token3d } from './Token3d';

const positions: Record<number, Vector3> = {
  '1': [0, 0, 0],
  '2': [0, 0, 0],
  '3': [0, 0, 0],
  '4': [0, 0, 0],
};

export const GameAreas = (props: {
  playerCount: number;
  hiddenCards: CardId[];
}) => {
  const { state } = useContext(StateContext);
  const { texture } = useTextures();

  const cardRenderer: CardAreaLayoutProps<CardState>['renderer'] = (p) => {
    // TODO component
    return (
      <Card3d
        key={p.item.id}
        id={p.item.id}
        name={`card-${p.item.id}`}
        size={{
          width: p.size.width / 1.2,
          height: p.size.height / 1.2,
        }}
        orientation={p.item.definition.orientation}
        rotation={[0, 0, 0]}
        position={[p.position[0], p.position[1], 0.001]}
        textures={{
          front:
            texture[
              getCardImageUrl(p.item.definition[p.item.sideUp], p.item.sideUp)
            ],
          back: texture[
            getCardImageUrl(p.item.definition[p.item.sideUp], p.item.sideUp)
          ],
        }}
        hidden={props.hiddenCards.includes(p.item.id)}
      >
        <Token3d
          position={[0.022, 0.01]}
          texture={texture[image.resource]}
          amount={p.item.token.resources}
        />
        <Token3d
          position={[0, 0.01]}
          texture={texture[image.damage]}
          amount={p.item.token.damage}
        />
        <Token3d
          position={[0.01, 0.022]}
          texture={texture[image.progress]}
          amount={p.item.token.progress}
        />
      </Card3d>
    );
  };

  const playerCount = props.playerCount;

  return (
    <group position={positions[playerCount]}>
      <Deck3d
        owner="game"
        type="encounterDeck"
        position={[0.35, 0.4, 0]}
        cardCount={state.zones.encounterDeck.cards.length}
        texture={texture[image.encounterBack]}
      />
      <Deck3d
        owner="game"
        type="discardPile"
        position={[0.45, 0.4, 0]}
        cardCount={state.zones.discardPile.cards.length}
        texture={texture[image.encounterBack]}
      />
      <CardAreaLayout
        color="gold"
        position={[0.2, 0.45]}
        size={{ width: 0.2, height: 0.1 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={state.zones.questArea.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
      <CardAreaLayout
        color="purple"
        position={[-0.2, 0.4]}
        size={{ width: 0.6, height: 0.2 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={state.zones.stagingArea.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
      <CardAreaLayout
        color="green"
        position={[0.2, 0.35]}
        size={{ width: 0.2, height: 0.1 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={state.zones.activeLocation.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
    </group>
  );
};
