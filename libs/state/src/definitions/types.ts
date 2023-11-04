import { Orientation, PrintedProps } from '@card-engine-nx/basic';
import { Ability } from '../card/ability/types';
import { Shadow } from '../card/ability/shadow';

export type CardDefinition = {
  front: PrintedProps & { abilities: Ability[] };
  back: PrintedProps & { abilities: Ability[] };
  shadow?: Shadow;
  orientation: Orientation;
};
