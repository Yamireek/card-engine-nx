import { indexOf } from 'lodash';
import { useContext } from 'react';
import { PlayerId } from '@card-engine-nx/basic';
import { getCardImageUrl } from '@card-engine-nx/ui';
import { DetailContext } from './DetailContext';
import { HandLayout } from './HandLayout';
import { useGameState } from './StateContext';

export const PlayerHand = (props: { player: PlayerId }) => {
  const { state, view, moves, actions } = useGameState();
  const detail = useContext(DetailContext);

  return (
    <HandLayout
      cards={state.players[props.player]?.zones.hand.cards.map((id) => ({
        id: id,
        image: getCardImageUrl(state.cards[id].definition.front, 'front'),
        activable: actions.some((a) => a.card === id),
      }))}
      cardWidth={200}
      rotate={2}
      onOver={(id) => detail.setDetail(id)}
      onActivation={(id) => {
        const cardActions = actions.filter((a) => a.card === id);

        if (
          cardActions.length === 0 ||
          !state.choice ||
          state.choice.type !== 'actions'
        ) {
          return;
        } else {
          if (cardActions.length === 1) {
            moves.action(indexOf(view.actions, cardActions[0]));
          } else {
            // tslint:disable-next-line:no-console
            console.log('todo multiple actions');
          }
        }
      }}
    />
  );
};
