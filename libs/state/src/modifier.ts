import { Modifier, Until } from './types';

export type ModifierState = {
  modifier: Modifier | Modifier[];
  until?: Until;
};
