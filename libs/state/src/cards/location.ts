import { LocationProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { CardModifier } from '../types';

export function location(
  props: Omit<LocationProps, 'type'>,
  ...abilities: CardModifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'location',
    },
    back: {
      type: 'encounter_back',
      abilities,
    },
    orientation: 'portrait',
  };
}
