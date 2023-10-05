import { TreacheryProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { CardModifier } from '../types';

export function treachery(
  props: Omit<TreacheryProps, 'type'>,
  ...abilities: CardModifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'treachery',
    },
    back: {
      type: 'encounter_back',
      abilities,
    },
    orientation: 'portrait',
  };
}
