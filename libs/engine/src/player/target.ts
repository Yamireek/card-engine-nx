import { PlayerId, keys } from '@card-engine-nx/basic';
import { State, PlayerTarget } from '@card-engine-nx/state';

export function getTargetPlayer(
  target: PlayerTarget,
  state: State
): PlayerId[] {
  if (target === 'each') {
    return keys(state.players);
  }

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
