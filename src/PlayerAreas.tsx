import {
  image,
  getCardImageUrl,
  Vector3,
  useTextures,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { CardState } from '@card-engine-nx/state';
import { Deck3d } from './Deck3d';
import { Token3d } from './Token3d';
import { UIEvents } from '@card-engine-nx/engine';
import { indexOf } from 'lodash';

const positions: Record<number, Partial<Record<PlayerId, Vector3>>> = {
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

const rotations: Record<number, Partial<Record<PlayerId, number>>> = {
  '1': { A: 0 },
  '2': { A: 0, B: 0 },
  '3': { A: 0, B: 0, C: Math.PI },
  '4': { A: 0, B: 0, C: Math.PI, D: Math.PI },
};

export const PlayerAreas = (props: {
  player: PlayerId;
  hiddenCards: CardId[];
  events: UIEvents;
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
      <Deck3d
        owner={props.player}
        type="library"
        position={[0.35, -0.4, 0]}
        cardCount={playerState.zones.library.cards.length}
        texture={texture[image.playerBack]}
      />
      <Deck3d
        owner={props.player}
        type="discardPile"
        position={[0.45, -0.4, 0]}
        cardCount={playerState.zones.discardPile.cards.length}
        texture={texture[image.playerBack]}
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
