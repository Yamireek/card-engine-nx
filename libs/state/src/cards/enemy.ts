import { EnemyProps } from '@card-engine-nx/basic';
import { CardDefinition, Shadow } from '../card';
import { Ability } from '../types';

export function enemy(
  props: Omit<EnemyProps, 'type'> & {
    shadow?: Shadow;
  },
  ...abilities: Ability[]
): CardDefinition {
  return {
    front: {
      ...props,
      abilities,
      sphere: [],
      type: 'enemy',
    },
    back: {
      type: 'encounter_back',
      abilities: [],
      traits: [],
      sphere: [],
    },
    shadow: props.shadow,
    orientation: 'portrait',
  };
}
