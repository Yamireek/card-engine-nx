import { Modifier } from './types';

export type ModifierState = {
  description: string;
  modifier: Modifier;
  until?: 'end_of_phase' | 'end_of_round';
};
