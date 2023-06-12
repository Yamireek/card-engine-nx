import {
  image,
  getCardImageUrl,
  Vector3,
  useTextures,
  Vector2,
  Dimensions,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { CardState } from '@card-engine-nx/state';
import { Deck3d } from './Deck3d';
import { Token3d } from './Token3d';
import { indexOf } from 'lodash';
import { max } from 'lodash/fp';
import React from 'react';
import { LotrDeck3d } from './LotrDeck3d';

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

export const LotrCard3d = (props: {
  cardId: CardId;
  hiddenCards: CardId[];
  position: Vector3;
  size: Dimensions;
}) => {
  const { state, view, moves } = useContext(StateContext);
  const { texture } = useTextures();

  const actions = view.actions.filter((a) => a.card === props.cardId);
  const card = state.cards[props.cardId];

  return (
    <Card3d
      id={props.cardId}
      name={`card-${props.cardId}`}
      size={{
        width: props.size.width,
        height: props.size.height,
      }}
      position={props.position}
      rotation={[0, 0, card.tapped ? -Math.PI / 4 : 0]}
      textures={{
        front: texture[getCardImageUrl(card.definition.front, 'front')],
        back: texture[getCardImageUrl(card.definition.back, 'back')],
      }}
      hidden={props.hiddenCards.includes(props.cardId)}
      onClick={() => {
        if (actions.length === 0 || !state.choice || state.choice.dialog) {
          return;
        } else {
          if (actions.length === 1) {
            moves.action(indexOf(view.actions, actions[0]));
          } else {
            // TODO multiple actions
            // tslint:disable-next-line:no-console
            console.log('todo multiple actions');
          }
        }
      }}
    >
      <Token3d
        position={[0.022, 0.01]}
        texture={texture[image.resource]}
        amount={card.token.resources}
      />
      <Token3d
        position={[0, 0.01]}
        texture={texture[image.damage]}
        amount={card.token.damage}
      />
      <Token3d
        position={[0.01, 0.03]}
        texture={texture[image.progress]}
        amount={card.token.progress}
      />
      {actions.length > 0 && (
        <mesh>
          <planeGeometry
            attach="geometry"
            args={[cardSize.width * 1.03, cardSize.height * 1.03]}
          />
          <meshStandardMaterial attach="material" color="yellow" />
        </mesh>
      )}
    </Card3d>
  );
};

export const CardArea = (props: {
  hiddenCards: CardId[];
  layout: Omit<
    CardAreaLayoutProps<CardState>,
    'itemSize' | 'items' | 'renderer'
  >;
  cards: CardId[];
}) => {
  const { state } = useContext(StateContext);

  const items = props.cards
    .map((id) => state.cards[id])
    .filter((c) => !c.attachedTo);

  const maxAttachments = max(items.map((i) => i.attachments.length)) ?? 0;

  const itemSize = {
    width: cardSize.width * 1.2,
    height: cardSize.height * (1.2 + maxAttachments * 0.2),
  };

  return (
    <CardAreaLayout
      {...props.layout}
      itemSize={itemSize}
      items={items}
      renderer={(p) => {
        const fullHeight = p.size.height;
        const scale = p.size.width / cardSize.width;
        const cardHeight = cardSize.height * scale;
        const offsetMin = -(fullHeight - cardHeight) / 2;
        const offsetMax = (fullHeight - cardHeight) / 2;
        const diff = (offsetMax - offsetMin) / p.item.attachments.length;
        const realItemSize = {
          width: p.size.width / 1.2,
          height: p.size.height / 1.2,
        };

        return (
          <React.Fragment key={p.item.id}>
            <LotrCard3d
              cardId={p.item.id}
              hiddenCards={props.hiddenCards}
              position={[p.position[0], p.position[1] + offsetMin, 0.01]}
              size={realItemSize}
            />
            {p.item.attachments.map((a, i) => {
              return (
                <LotrCard3d
                  key={a}
                  cardId={a}
                  hiddenCards={props.hiddenCards}
                  size={realItemSize}
                  position={[
                    p.position[0],
                    p.position[1] + offsetMin + diff * (i + 1),
                    0.01 - (i + 1) * 0.001,
                  ]}
                />
              );
            })}
          </React.Fragment>
        );
      }}
    />
  );
};

export const PlayerAreas = (props: {
  player: PlayerId;
  hiddenCards: CardId[];
}) => {
  const { state, view, moves } = useContext(StateContext);
  const { texture } = useTextures();
  const playerState = state.players[props.player];

  const cardRenderer: CardAreaLayoutProps<CardState>['renderer'] = (p) => {
    const actions = view.actions.filter((a) => a.card === p.item.id);

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
        rotation={[0, 0, p.item.tapped ? -Math.PI / 4 : 0]}
        textures={{
          front: texture[getCardImageUrl(p.item.definition.front, 'front')],
          back: texture[getCardImageUrl(p.item.definition.back, 'back')],
        }}
        hidden={props.hiddenCards.includes(p.item.id)}
        onClick={() => {
          if (actions.length === 0 || !state.choice || state.choice.dialog) {
            return;
          } else {
            if (actions.length === 1) {
              moves.action(indexOf(view.actions, actions[0]));
            } else {
              // TODO multiple actions
              // tslint:disable-next-line:no-console
              console.log('todo multiple actions');
            }
          }
        }}
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
          position={[0.01, 0.03]}
          texture={texture[image.progress]}
          amount={p.item.token.progress}
        />
        {actions.length > 0 && (
          <mesh>
            <planeGeometry
              attach="geometry"
              args={[cardSize.width * 1.03, cardSize.height * 1.03]}
            />
            <meshStandardMaterial attach="material" color="yellow" />
          </mesh>
        )}
      </Card3d>
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
      <LotrDeck3d
        zone={{ owner: props.player, type: 'library' }}
        position={[0.35, -0.4, 0]}
      />
      <LotrDeck3d
        zone={{ owner: props.player, type: 'discardPile' }}
        position={[0.45, -0.4, 0]}
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
      <CardArea
        layout={{
          color: 'green',
          position: [0, -0.15],
          size: { width: 1, height: 0.3 },
        }}
        hiddenCards={props.hiddenCards}
        cards={playerState.zones.playerArea.cards}
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
