import { PlayerId, keys } from '@card-engine-nx/basic';
import { State, PlayerTarget } from '@card-engine-nx/state';

export function getTargetPlayer(
  target: PlayerTarget,
  state: State
): PlayerId[] {
  if (target === 'each') {
    return keys(state.players);
  }

  if (['A', 'B', 'C', 'D'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
