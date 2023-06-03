import {
  image,
  getCardImageUrl,
  Vector3,
  getCardImageUrls,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { CardState } from '@card-engine-nx/state';
import { Deck3d } from './Deck3d';
import { Textures } from './types';
import { last } from 'lodash';

export const positions: Record<number, Vector3> = {
  '1': [0, 0, 0],
  '2': [0, 0, 0],
  '3': [0, 0, 0],
  '4': [0, 0, 0],
};

const QuestDeck = (props: { textures: Textures }) => {
  const { state } = useContext(StateContext);
  const topCardId = last(state.zones.questDeck.cards);
  const topCard = topCardId ? state.cards[topCardId] : undefined;
  const cardImages = topCard ? getCardImageUrls(topCard.definition) : undefined;
  return (
    <Deck3d
      owner="game"
      type="questDeck"
      position={[0.2, 0.45, 0]}
      orientation="landscape"
      cardCount={state.zones.questDeck.cards.length}
      texture={
        cardImages && topCard
          ? props.textures[cardImages[topCard.sideUp]]
          : props.textures[image.encounterBack]
      }
    />
  );
};

export const GameAreas = (props: {
  playerCount: number;
  textures: Textures;
  hiddenCards: CardId[];
}) => {
  const { state } = useContext(StateContext);

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

  const playerCount = props.playerCount;

  return (
    <group position={positions[playerCount]}>
      <Deck3d
        owner="game"
        type="encounterDeck"
        position={[0.35, 0.4, 0]}
        cardCount={state.zones.encounterDeck.cards.length}
        texture={props.textures[image.encounterBack]}
      />
      <Deck3d
        owner="game"
        type="discardPile"
        position={[0.45, 0.4, 0]}
        cardCount={state.zones.discardPile.cards.length}
        texture={props.textures[image.encounterBack]}
      />
      <QuestDeck textures={props.textures} />
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
