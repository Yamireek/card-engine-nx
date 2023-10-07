import { EventProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';

export function event(
  props: Omit<EventProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'event',
    },
    back: {
      type: 'player_back',
      abilities: [],
    },
    orientation: 'portrait',
  };
}
