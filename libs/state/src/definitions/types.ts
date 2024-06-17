import { Orientation } from '@card-engine-nx/basic';
import { CardRules } from '../card';
import { Shadow } from '../card/ability/shadow';
import { PrintedProps } from '../card/props';

export type CardProps = PrintedProps & {
  rules?: CardRules;
};

export type CardDefinition = {
  front: CardProps;
  back: CardProps;
  shadow?: Shadow;
  orientation: Orientation;
};
