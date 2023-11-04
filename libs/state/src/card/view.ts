import { CardId, PrintedProps, ZoneId } from '@card-engine-nx/basic';
import { CostModifier } from './modifier/cost';
import { NextStage } from './ability/nextStage';
import { BoolExpr } from '../expression/bool';
import { CardTarget } from './target';
import { CardAction } from './action';
import { Action } from '../action';
import { CardRules } from './rules';

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  zone: ZoneId;
  attachesTo?: CardTarget;
  nextStage?: NextStage;
  effects: string[];
  whenRevealed: Array<{ description: string; action: Action }>;
  travel: Action[];
  conditional: {
    advance: BoolExpr[];
    travel: BoolExpr[];
  };
  refreshCost: CardAction[];
  cost?: CostModifier;
  rules: CardRules;
  shadows: Array<{ description: string; action: Action }>;
};
