import { Orientation, PrintedProps } from '@card-engine-nx/basic';
import { Shadow } from '../card/ability/shadow';
import { Ability } from '../card/ability/types';

export type CardDefinition = {
  front: PrintedProps & { abilities: Ability[] };
  back: PrintedProps & { abilities: Ability[] };
  shadow?: Shadow;
  orientation: Orientation;
};
