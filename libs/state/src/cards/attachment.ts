import { AttachmentProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';

export function attachment(
  props: Omit<AttachmentProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      sphere: [props.sphere],
      abilities,
      type: 'attachment',
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
