import { HeroProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';

export function hero(
  props: Omit<HeroProps, 'type' | 'unique'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      sphere: [props.sphere],
      abilities,
      type: 'hero',
      unique: true,
    },
    back: {
      type: 'player_back',
      abilities: [],
      traits: [],
    },
    orientation: 'portrait',
  };
}
