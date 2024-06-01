import { CardId, PrintedProps, ZoneId } from '@card-engine-nx/basic';
import { CardRules } from './rules';
import { CardTarget } from './target';

export type CardView = {
  id: CardId;
  printed: PrintedProps;
  props: PrintedProps;
  zone: ZoneId;
  attachesTo?: CardTarget; // TODO move to rules
  rules: CardRules;
};
