import { CardTarget, State } from '@card-engine-nx/state';
import { isArray } from 'lodash';

export function getCardTargetText(target: CardTarget, state: State): string {
  if (isArray(target)) {
    return target.map((t) => getCardTargetText(t, state)).join(', ');
  }

  if (typeof target === 'number') {
    return state.cards[target].view.props.name ?? '';
  }

  return JSON.stringify(target, null, 1);
}
