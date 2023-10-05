import { EventProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { CardModifier } from '../types';

export function event(
  props: Omit<EventProps, 'type'>,
  ...abilities: CardModifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'event',
    },
    back: {
      type: 'player_back',
      abilities,
    },
    orientation: 'portrait',
  };
}
