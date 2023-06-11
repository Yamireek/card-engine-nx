import { PlayerId, values } from '@card-engine-nx/basic';
import { State, PlayerTarget } from '@card-engine-nx/state';
import { isArray } from 'lodash';

export function getTargetPlayer(
  target: PlayerTarget,
  state: State
): PlayerId[] {
  if (isArray(target)) {
    return target;
  }

  if (target === 'each') {
    return values(state.players)
      .filter((p) => !p.eliminated)
      .map((p) => p.id);
  }

  if (target === 'owner') {
    throw new Error('not implemented');
  }

  if (target === 'first') {
    // TODO fix
    return ['0'];
  }

  if (['0', '1', '2', '3'].includes(target)) {
    return [target];
  }

  throw new Error(`unknown player target: ${JSON.stringify(target)}`);
}
