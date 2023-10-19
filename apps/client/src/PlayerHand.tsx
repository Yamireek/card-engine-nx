import { getCardImageUrl } from '@card-engine-nx/ui';
import { useGameState } from './StateContext';
import { PlayerId } from '@card-engine-nx/basic';
import { useContext } from 'react';
import { DetailContext } from './DetailContext';
import { indexOf } from 'lodash';
import { HandLayout } from './HandLayout';

export const PlayerHand = (props: { player: PlayerId }) => {
  const { state, view, moves } = useGameState();
  const detail = useContext(DetailContext);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: -100,
        width: 'calc(100% - 300px)',
      }}
    >
      <HandLayout
        cards={state.players[props.player]?.zones.hand.cards.map((id) => ({
          id: id,
          image: getCardImageUrl(state.cards[id].definition.front, 'front'),
          activable: view.actions.some((a) => a.card === id && a.enabled),
        }))}
        cardWidth={200}
        rotate={2}
        onOver={(id) => detail.setDetail(id)}
        onActivation={(id) => {
          const actions = view.actions.filter(
            (a) => a.card === id && a.enabled
          );

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
      />
    </div>
  );
};
