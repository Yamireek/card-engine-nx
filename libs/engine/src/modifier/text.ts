import { GameModifier, State } from '@card-engine-nx/state';
import { getCardModifierText } from '../card/modifier/text';
import { getCardTargetText } from '../card/target/text';

export function getModifierText(modifier: GameModifier, state: State) {
  const until =
    modifier.until !== undefined
      ? `until ${modifier.until.replaceAll('_', ' ')}`
      : undefined;

  if ('card' in modifier) {
    const target = getCardTargetText(modifier.card, state);
    return `${target} ${getCardModifierText(
      modifier.modifier
    )} ${until}`.trim();
  }

  return JSON.stringify(modifier, null, 1);
}
