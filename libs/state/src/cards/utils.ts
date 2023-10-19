import { Shadow } from '../card';
import { Ability } from '../types';

export function getShadowAbility(abilities: Ability[]): Shadow | undefined {
  const shadow = abilities.flatMap((a) => {
    if ('shadow' in a) {
      return a;
    } else {
      return [];
    }
  });

  if (shadow.length === 0) {
    return undefined;
  }

  if (shadow.length === 1) {
    return {
      description: shadow[0].description,
      action: shadow[0].shadow,
    };
  }

  throw new Error('multiple shadow effects found');
}
