import { EventProps } from '@card-engine-nx/basic';
import { CardDefinition } from './types';
import { Ability } from '../card/ability/types';

export function event(
  props: Omit<EventProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      sphere: [props.sphere],
      abilities,
      type: 'event',
      traits: [],
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
