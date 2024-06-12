import { CardId, Until } from '@card-engine-nx/basic';
import { CardModifier } from './card/modifier/type';
import { CardTarget } from './card/target';
import { BoolExpr } from './expression/bool';
import { PlayerRules } from './player';
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
  modifier: PlayerRules;
  condition?: BoolExpr;
  until?: Until;
};
