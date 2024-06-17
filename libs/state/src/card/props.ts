import { CardType, Trait, Sphere, Keywords } from '@card-engine-nx/basic';
import { Ability } from './ability';

export type PrintedProps = {
  type: CardType;
  name?: string;
  threatCost?: number;
  willpower?: number;
  attack?: number;
  defense?: number;
  hitPoints?: number;
  traits?: Trait[];
  sphere?: Sphere[];
  sequence?: number;
  questPoints?: number;
  cost?: number | 'X';
  unique?: boolean;
  engagement?: number;
  threat?: number;
  keywords?: Keywords;
  hitpoints?: number;
  victory?: number;
  abilities?: Ability[];
};
