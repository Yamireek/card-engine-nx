import { Modifier, Until } from './types';

export type ModifierState = {
  description: string;
  modifier: Modifier;
  until?: Until;
};
