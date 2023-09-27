import { AttachmentProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Modifier } from '../types';

export function attachment(
  props: Omit<AttachmentProps, 'type'>,
  ...abilities: Modifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'attachment',
    },
    back: {
      type: 'player_back',
      abilities,
    },
    orientation: 'portrait',
  };
}
