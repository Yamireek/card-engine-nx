import { TreacheryProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Modifier } from '../types';

export function treachery(
  props: Omit<TreacheryProps, 'type'>,
  ...abilities: Modifier[]
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
