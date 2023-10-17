import { CardTarget, GameModifier, State, View } from '@card-engine-nx/state';
import { isArray } from 'lodash';
import { getCardModifierText } from './card/modifiers';

export function getModifierText(
  modifier: GameModifier,
  state: State,
  view: View
) {
  const until =
    modifier.until !== undefined
      ? `until ${modifier.until.replaceAll('_', ' ')}`
      : undefined;

  if ('card' in modifier) {
    const target = getCardTargetText(modifier.card, state, view);
    return `${target} ${getCardModifierText(
      modifier.modifier
    )} ${until}`.trim();
  }

  return JSON.stringify(modifier, null, 1);
}

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
