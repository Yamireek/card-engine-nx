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
  attachesTo?: CardTarget; // TODO move to rules
  nextStage?: NextStage; // TODO move to rules
  effects: string[]; // TODO delete?
  whenRevealed: Array<{ description: string; action: Action }>; // TODO move to rules
  travel: Action[]; // TODO move to rules
  conditional: {
    advance: BoolExpr[]; // TODO move to rules
    travel: BoolExpr[]; // TODO move to rules
  };
  refreshCost: CardAction[]; // TODO move to rules
  cost?: CostModifier; // TODO move to rules
  rules: CardRules;
};
