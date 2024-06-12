import { indexOf } from 'lodash';
import { useContext } from 'react';
import { CardId } from '@card-engine-nx/basic';
import {
  image,
  getCardImageUrl,
  Vector3,
  useTextures,
  Dimensions,
} from '@card-engine-nx/ui';
import { StateContext } from '../game/StateContext';
import { Card3d, cardSize } from './Card3d';
import { useFloatingCards } from './FloatingCardsContext';
import { Token3d } from './Token3d';

export const LotrCard3d = (props: {
  cardId: CardId;
  position: Vector3;
  size: Dimensions;
}) => {
  const { moves, ctx } = useContext(StateContext);
  const { texture } = useTextures();
  const { floatingCards: cards } = useFloatingCards();

  const cardActions = ctx.actions.filter(
    (a) => a.source === props.cardId
  );

  const state = ctx.state;
  const card = ctx.cards[props.cardId].state;

  const textures = {
    front: texture[getCardImageUrl(card.definition.front, 'front')],
    back: texture[getCardImageUrl(card.definition.back, 'back')],
  };

  const orientation = card.definition.orientation;

  return (
    <Card3d
      id={props.cardId}
      name={`card-${props.cardId}`}
      size={{
        width: props.size.width,
        height: props.size.height,
      }}
      position={props.position}
      rotation={[
        0,
        0,
        card.tapped ? -Math.PI / 4 : card.shadowOf ? Math.PI / 3 : 0,
      ]}
      texture={
        card.sideUp === 'front' || card.sideUp === 'shadow'
          ? textures
          : { front: textures.back, back: textures.front }
      }
      orientation={orientation}
      hidden={cards.some((c) => c.id === props.cardId)}
      onClick={() => {
        if (
          cardActions.length === 0 ||
          !state.choice ||
          state.choice.type !== 'actions'
        ) {
          return;
        } else {
          if (cardActions.length === 1) {
            moves.action(indexOf(ctx.actions, cardActions[0]));
          } else {
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
        position={orientation === 'portrait' ? [0.01, 0.03] : [0.03, 0.01]}
        texture={texture[image.progress]}
        amount={card.token.progress}
      />
      {cardActions.length > 0 && state.choice?.type === 'actions' && (
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
