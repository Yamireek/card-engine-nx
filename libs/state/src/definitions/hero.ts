import { HeroProps } from '@card-engine-nx/basic';
import { Ability } from '../card/ability/types';
import { CardDefinition } from './types';

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
      sphere: [],
    },
    orientation: 'portrait',
  };
}
