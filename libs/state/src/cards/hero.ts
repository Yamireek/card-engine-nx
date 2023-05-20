import { HeroProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';

export function hero(
  props: Omit<HeroProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'hero',
    },
    back: {
      type: 'empty',
      abilities,
    },
    orientation: 'portrait',
  };
}
