import {
  GameZoneType,
  PlayerId,
  PlayerZoneType,
} from '@card-engine-nx/basic';
import {
  CardState,
  CardAction,
  PlayerState,
  PlayerAction,
  State,
} from '@card-engine-nx/state';
import { last } from 'lodash';
import { Events } from '../events';

export type ZoneId =
  | { owner: 'game'; type: GameZoneType }
  | { owner: PlayerId; type: PlayerZoneType };

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
        events.cardMoved(
          top,
          { type: 'library', owner: player.id },
          { type: 'hand', owner: player.id },
          'front'
        );
      }
    }

    return;
  }

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}
