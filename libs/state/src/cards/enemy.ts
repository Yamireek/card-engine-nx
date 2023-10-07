import { EnemyProps } from '@card-engine-nx/basic';
import { CardDefinition } from '../card';
import { Ability } from '../types';

export function enemy(
  props: Omit<EnemyProps, 'type'>,
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      type: 'enemy',
    },
    back: {
      type: 'encounter_back',
      abilities: [],
      traits: [],
    },
    orientation: 'portrait',
  };
}
