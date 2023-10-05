import { CardModifier, Until } from './types';

export type ModifierState = {
  modifier: CardModifier | CardModifier[];
  until?: Until;
};
