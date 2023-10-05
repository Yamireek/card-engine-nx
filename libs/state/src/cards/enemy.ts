import { EnemyProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { CardModifier } from '../types';

export function enemy(
  props: Omit<EnemyProps, 'type'>,
  ...abilities: CardModifier[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'enemy',
    },
    back: {
      type: 'encounter_back',
      abilities,
    },
    orientation: 'portrait',
  };
}
