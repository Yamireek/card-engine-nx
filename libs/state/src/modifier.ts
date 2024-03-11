import { CardId, Until } from '@card-engine-nx/basic';
import { CardModifier } from './card/modifier/type';
import { BoolExpr } from './expression/bool';
import { CardTarget } from './card/target';
import { PlayerTarget } from './player/target';
import { PlayerModifier } from './player/modifier/types';

export type GameModifier = CardGlobalModifier | PlayerGlobalModifier;

export type CardGlobalModifier = {
  source: CardId;
  card: CardTarget;
  modifier: CardModifier;
  condition?: BoolExpr;
  until?: Until;
  deps?: Dependencies;
  applied?: boolean;
};

export type PlayerGlobalModifier = {
  source: CardId;
  player: PlayerTarget;
  modifier: PlayerModifier;
  condition?: BoolExpr;
  until?: Until;
  deps?: Dependencies;
  applied?: boolean;
};

export type Dependencies = { game?: GameDependency[] };

export type GameDependency = 'phase' | 'round';
