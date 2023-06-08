import { PlayerId } from '@card-engine-nx/basic';
import { State, PlayerTarget } from '@card-engine-nx/state';

export function getTargetPlayer(
  target: PlayerTarget,
  state: State
): PlayerId[] {
  if (target === 'each') {
    return Object.keys(state.players) as PlayerId[]; // TODO
  }

  if (target === 'owner') {
    throw new Error('not implemented');
  }

  if (['0', '1', '2', '3'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
