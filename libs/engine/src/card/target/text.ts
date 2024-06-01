import { isArray } from 'lodash';
import { CardTarget, State, View } from '@card-engine-nx/state';

export function getCardTargetText(
  target: CardTarget,
  state: State,
  view: View
): string {
  if (isArray(target)) {
    return target.map((t) => getCardTargetText(t, state, view)).join(', ');
  }

  if (typeof target === 'number') {
    return view.cards[target].props.name ?? '';
  }

  return JSON.stringify(target, null, 1);
}
