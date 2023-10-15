import { TreacheryProps } from '@card-engine-nx/basic';
import { CardDefinition, Shadow } from '../card';
import { Ability } from '../types';

export function treachery(
  props: Omit<TreacheryProps, 'type'> & {
    shadow?: Shadow;
  },
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'treachery',
      sphere: [],
      traits: [],
    },
    back: {
      type: 'encounter_back',
      abilities: [],
      sphere: [],
      traits: [],
    },
    shadow: props.shadow,
    orientation: 'portrait',
  };
}
