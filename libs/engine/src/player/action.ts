import { PlayerState, PlayerAction, State } from '@card-engine-nx/state';
import { last } from 'lodash';
import { Events } from '../events';
import { calculateExpr } from '../expr';

export function executePlayerAction(
  action: PlayerAction,
  player: PlayerState,
  state: State,
  events: Events
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
        if (events.onCardMoved) {
          events.onCardMoved(
            top,
            { type: 'library', owner: player.id },
            { type: 'hand', owner: player.id },
            'front'
          );
        }
      }
    }
    return;
  }

  if (action.incrementThreat) {
    const amount = calculateExpr(action.incrementThreat, state, {});
    player.thread += amount;
    return;
  }

  throw new Error(`unknown player action: ${JSON.stringify(action)}`);
}
