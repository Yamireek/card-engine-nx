import { CardId, PrintedProps, ZoneId } from '@card-engine-nx/basic';
import { CardTarget } from './target';
import { CardRules } from './rules';

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  zone: ZoneId;
  attachesTo?: CardTarget; // TODO move to rules
  rules: CardRules;
};
