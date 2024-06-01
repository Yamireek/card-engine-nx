import { EventProps } from '@card-engine-nx/basic';
import { Ability } from '../card/ability/types';
import { CardDefinition } from './types';

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
