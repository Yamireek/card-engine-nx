import { PlayerState, PlayerAction, State, View } from '@card-engine-nx/state';
import { last } from 'lodash';
import { calculateExpr } from '../expr';
import { UIEvents } from '../uiEvents';
import { uiEvent } from '../eventFactories';

export function executePlayerAction(
  action: PlayerAction,
  player: PlayerState,
  state: State,
  view: View,
  events: UIEvents
) {
  if (action === 'empty') {
    return;
  }

  if (action.draw) {
    for (let index = 0; index < action.draw; index++) {
      const top = last(player.zones.library.cards);
      if (top) {
        state.cards[top].sideUp = 'front';
        player.zones.library.cards.pop();
        player.zones.hand.cards.push(top);
        events.send(
          uiEvent.card_moved({
            cardId: top,
            source: { type: 'library', owner: player.id },
            destination: { type: 'hand', owner: player.id },
            side: 'front',
          })
        );
      }
    }
    return;
  }

  if (action.incrementThreat) {
    const amount = calculateExpr(action.incrementThreat, state, view, {});
    player.thread += amount;
    return;
  }

  throw new Error(`unknown player action: ${JSON.stringify(action)}`);
}
