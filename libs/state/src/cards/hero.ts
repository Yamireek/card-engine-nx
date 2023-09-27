import { HeroProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Modifier } from '../types';

export function hero(
  props: Omit<HeroProps, 'type' | 'unique'>,
  ...abilities: Modifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'hero',
      unique: true,
    },
    back: {
      type: 'player_back',
      abilities,
    },
    orientation: 'portrait',
  };
}
