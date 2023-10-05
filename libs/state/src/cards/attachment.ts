import { AttachmentProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { CardModifier } from '../types';

export function attachment(
  props: Omit<AttachmentProps, 'type'>,
  ...abilities: CardModifier[]
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
