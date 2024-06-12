import { indexOf } from 'lodash';
import { useContext } from 'react';
import { PlayerId } from '@card-engine-nx/basic';
import { getCardImageUrl } from '@card-engine-nx/ui';
import { DetailContext } from './DetailContext';
import { HandLayout } from './HandLayout';
import { useGameState } from './StateContext';

export const PlayerHand = (props: { player: PlayerId }) => {
  const { ctx, moves } = useGameState();
  const detail = useContext(DetailContext);

  const actions = ctx.actions;

  return (
    <HandLayout
      cards={ctx.state.players[props.player]?.zones.hand.cards.map((id) => ({
        id: id,
        image: getCardImageUrl(ctx.state.cards[id].definition.front, 'front'),
        activable: actions.some((a) => a.source === id),
      }))}
      cardWidth={200}
      rotate={2}
      onOver={(id) => detail.setDetail(id)}
      onActivation={(id) => {
        const cardActions = actions.filter((a) => a.source === id);

        if (
          cardActions.length === 0 ||
          !ctx.state.choice ||
          ctx.state.choice.type !== 'actions'
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
    />
  );
};
