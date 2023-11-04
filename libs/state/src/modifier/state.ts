import { GameModifier } from '../modifier';

export type GameModifierState = {
  applied: boolean;
  modifier: GameModifier;
};
