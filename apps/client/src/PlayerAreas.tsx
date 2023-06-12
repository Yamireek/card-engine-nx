import {
  image,
  getCardImageUrl,
  Vector3,
  useTextures,
  Dimensions,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { Token3d } from './Token3d';
import { indexOf } from 'lodash';
import React from 'react';
import { LotrDeck3d } from './LotrDeck3d';
import { useFloatingCards } from './FloatingCardsContext';
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

export const LotrCard3d = (props: {
  cardId: CardId;
  position: Vector3;
  size: Dimensions;
}) => {
  const { state, view, moves } = useContext(StateContext);
  const { texture } = useTextures();
  const { floatingCards: cards } = useFloatingCards();

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
      hidden={cards.some((c) => c.id === props.cardId)}
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
