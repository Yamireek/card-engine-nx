import { TreacheryProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';
import { getShadowAbility } from './utils';

export function treachery(
  props: Omit<TreacheryProps, 'type'>,
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
    shadow: getShadowAbility(abilities),
    orientation: 'portrait',
  };
}
