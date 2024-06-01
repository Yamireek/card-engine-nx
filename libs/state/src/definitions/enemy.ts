import { EnemyProps } from '@card-engine-nx/basic';
import { Ability } from '../card/ability/types';
import { CardDefinition } from './types';
import { getShadowAbility } from './utils';

export function enemy(
  props: Omit<EnemyProps, 'type'>,
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
    shadow: getShadowAbility(abilities),
    orientation: 'portrait',
  };
}
