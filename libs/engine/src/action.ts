import { Action, State } from '@card-engine-nx/state';
import { getTargetPlayer } from './player/target';
import { executePlayerAction } from './player/action';
import { Events } from './events';
import { getZoneState } from './zone/target';
import { shuffle } from 'lodash';

export function executeAction(action: Action, state: State, events: Events) {
  if (action === 'empty') {
    return;
  }

  if (action.shuffle) {
    const zone = getZoneState(action.shuffle.zone, state);
    zone.cards = shuffle(zone.cards);
    return;
  }

  if (action.player) {
    const ids = getTargetPlayer(action.player.target, state);
    for (const id of ids) {
      const player = state.players[id];
      if (player) {
        executePlayerAction(action.player.action, player, state, events);
      } else {
        throw new Error('player not found');
      }
    }
    return;
  }

  if (action.sequence) {
    state.next = [...action.sequence, ...state.next];
    return;
  }

  throw new Error(`unknown  action: ${JSON.stringify(action)}`);
}
