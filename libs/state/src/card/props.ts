import {
  CardType,
  Trait,
  Sphere,
  Keywords,
  CardNumProp,
} from '@card-engine-nx/basic';
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

export type PropertyModifier =
  | {
      prop: CardNumProp;
      op: 'inc';
      value: number;
    }
  | {
      prop: CardNumProp;
      op: 'mul';
      value: number;
    }
  | {
      prop: CardNumProp;
      op: 'set';
      value: number;
    }
  | {
      prop: 'traits';
      op: 'add';
      value: Trait[];
    }
  | {
      prop: 'sphere';
      op: 'add';
      value: Sphere[];
    }
  | {
      prop: 'keywords';
      op: 'add';
      value: Keywords;
    }
  | {
      prop: 'type';
      op: 'set';
      value: CardType;
    };
