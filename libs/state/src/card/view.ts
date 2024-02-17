import { CardId, PrintedProps, ZoneId } from '@card-engine-nx/basic';
import { NextStage } from './ability/nextStage';
import { CardTarget } from './target';
import { CardRules } from './rules';

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  zone: ZoneId;
  attachesTo?: CardTarget; // TODO move to rules
  nextStage?: NextStage; // TODO move to rules
  rules: CardRules;
};
