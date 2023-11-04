import { Until } from '@card-engine-nx/basic';
import { CardModifier } from './type';

export type ModifierState = {
  modifier: CardModifier | CardModifier[];
  until?: Until;
};
