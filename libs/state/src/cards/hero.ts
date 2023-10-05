import { HeroProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { CardModifier } from '../types';

export function hero(
  props: Omit<HeroProps, 'type' | 'unique'>,
  ...abilities: CardModifier[]
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
