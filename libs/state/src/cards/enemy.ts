import { EnemyProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Modifier } from '../types';

export function enemy(
  props: Omit<EnemyProps, 'type'>,
  ...abilities: Modifier[]
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
