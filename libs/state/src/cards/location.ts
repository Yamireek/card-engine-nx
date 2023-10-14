import { LocationProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';

export function location(
  props: Omit<LocationProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      sphere: [],
      type: 'location',
    },
    back: {
      type: 'encounter_back',
      abilities: [],
      traits: [],
      sphere: [],
    },
    orientation: 'portrait',
  };
}
