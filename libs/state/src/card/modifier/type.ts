import { CardType, Keywords, Sphere, Trait } from '@card-engine-nx/basic';
import { Action } from '../../action';
import { EventType } from '../../event/type';
import { BoolExpr } from '../../expression/bool';
import { CardBoolExpr } from '../expression/bool';
import { CardRules } from '../rules';
import { CostModifier } from './cost';
import { PropertyIncrement } from './increment';

export type CardModifier =
  | {
      description: string;
      reaction: {
        event: EventType;
        condition?: BoolExpr;
        action: Action;
        forced: boolean;
      };
    }
  | {
      description: string;
      action: Action;
    }
  | {
      description: string;
      shadow: Action;
    }
  | {
      increment: PropertyIncrement;
    }
  | {
      add: {
        trait?: Trait | Trait[];
        sphere?: Sphere | Sphere[];
        keyword?: Keywords;
      };
    }
  | { setup: Action }
  | {
      cost: CostModifier;
    }
  | { replaceType: CardType }
  | {
      if: {
        condition: CardBoolExpr;
        true?: CardModifier | CardModifier[];
        false?: CardModifier | CardModifier[];
      };
    }
  | {
      rules: CardRules;
    };
