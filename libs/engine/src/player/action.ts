import { PlayerState, PlayerAction, State } from '@card-engine-nx/state';
import { last } from 'lodash';
import { Events } from '../events';

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

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}
