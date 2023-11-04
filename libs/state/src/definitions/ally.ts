import { AllyProps } from '@card-engine-nx/basic';
import { CardDefinition } from './types';
import { Ability } from '../card/ability/types';

export function ally(
  props: Omit<AllyProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      sphere: [props.sphere],
      abilities,
      type: 'ally',
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
