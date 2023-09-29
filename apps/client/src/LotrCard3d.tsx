import {
  image,
  getCardImageUrl,
  Vector3,
  useTextures,
  Dimensions,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId, Orientation } from '@card-engine-nx/basic';
import { Card3d, cardSize } from './Card3d';
import { Token3d } from './Token3d';
import { indexOf } from 'lodash';
import { useFloatingCards } from './FloatingCardsContext';

export const LotrCard3d = (props: {
  cardId: CardId;
  position: Vector3;
  size: Dimensions;
  orientation?: Orientation;
}) => {
  const { state, view, moves } = useContext(StateContext);
  const { texture } = useTextures();
  const { floatingCards: cards } = useFloatingCards();

  const actions = view.actions.filter(
    (a) => a.card === props.cardId && a.enabled === true
  );
  const card = state.cards[props.cardId];

  const textures = {
    front: texture[getCardImageUrl(card.definition.front, 'front')],
    back: texture[getCardImageUrl(card.definition.back, 'back')],
  };

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
      texture={
        card.sideUp === 'front'
          ? textures
          : { front: textures.back, back: textures.front }
      }
      orientation={props.orientation}
      hidden={cards.some((c) => c.id === props.cardId)}
      onClick={() => {
        if (
          actions.length === 0 ||
          !state.choice ||
          state.choice.type !== 'actions'
        ) {
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
