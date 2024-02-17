import { CardType, Keywords, Sphere, Trait } from '@card-engine-nx/basic';
import { CardRules } from '../rules';
import { Action } from '../../action';
import { CardAction } from '../action';
import { CardBoolExpr } from '../expression/bool';
import { BoolExpr } from '../../expression/bool';
import { EventType } from '../../event/type';
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
      increment: PropertyIncrement;
    }
  | {
      refreshCost: CardAction;
    }
  | { travel: Action }
  | { setup: Action }
  | { nextStage: 'random' }
  | {
      conditional: {
        advance: BoolExpr;
      };
    }
  | {
      cost: CostModifier;
    }
  | { keywords: Keywords }
  | { replaceType: CardType }
  | { replaceType: CardType }
  | { addTrait: Trait }
  | {
      if: {
        condition: CardBoolExpr;
        true?: CardModifier | CardModifier[];
        false?: CardModifier | CardModifier[];
      };
    }
  | { addSphere: Sphere }
  | {
      rule: CardRules;
    }
  | {
      description: string;
      shadow: Action;
    };
