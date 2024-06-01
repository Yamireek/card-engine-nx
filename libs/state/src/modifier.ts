import { CardId, Until } from '@card-engine-nx/basic';
import { CardModifier } from './card/modifier/type';
import { CardTarget } from './card/target';
import { BoolExpr } from './expression/bool';
import { PlayerModifier } from './player/modifier/types';
import { PlayerTarget } from './player/target';

export type GameModifier = CardGlobalModifier | PlayerGlobalModifier;

export type CardGlobalModifier = {
  source: CardId;
  card: CardTarget;
  modifier: CardModifier;
  condition?: BoolExpr;
  until?: Until;
};

export type PlayerGlobalModifier = {
  source: CardId;
  player: PlayerTarget;
  modifier: PlayerModifier;
  condition?: BoolExpr;
  until?: Until;
};
