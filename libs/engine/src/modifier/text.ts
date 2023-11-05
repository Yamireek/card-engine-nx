import { GameModifier, State, View } from '@card-engine-nx/state';
import { getCardModifierText } from '../card/modifier/text';
import { getCardTargetText } from '../card/target/text';

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
