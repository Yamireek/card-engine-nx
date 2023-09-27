import { AllyProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Modifier } from '../types';

export function ally(
  props: Omit<AllyProps, 'type'>,
  ...abilities: Modifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'ally',
    },
    back: {
      type: 'player_back',
      abilities: abilities,
    },
    orientation: 'portrait',
  };
}
