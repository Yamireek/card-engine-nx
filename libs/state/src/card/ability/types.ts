import { GameZoneType, Phase, PlayerZoneType } from '@card-engine-nx/basic';
import { Action } from '../../action';
import { BoolExpr } from '../../expression/bool';
import { PlayerModifier } from '../../player/modifier/types';
import { PlayerTarget } from '../../player/target';
import { CostModifier } from '../modifier/cost';
import { PropertyIncrement } from '../modifier/increment';
import { CardModifier } from '../modifier/type';
import { ResponseAction } from '../response';
import { CardRules } from '../rules';
import { CardTarget } from '../target';
import { Limit } from './limit';

// TODO morf to rules modifiers
export type Ability = { description: string } & (
  | {
      whenRevealed: Action;
    }
  | { shadow: Action }
  | {
      action: Action;
      payment?: CostModifier;
      phase?: Phase;
      limit?: Limit;
    }
  | {
      card: CardModifier | CardModifier[];
      target?: CardTarget;
      condition?: BoolExpr;
    }
  | {
      increment: PropertyIncrement;
      target?: CardTarget;
    }
  | { rule: CardRules }
  | {
      player: PlayerModifier;
      target: PlayerTarget;
      condition?: BoolExpr;
    }
  | {
      setup: Action;
    }
  | {
      travel: Action;
    }
  | {
      response: ResponseAction;
      target?: CardTarget;
      zone?: GameZoneType | PlayerZoneType;
      payment?: CostModifier;
    }
  | { forced: ResponseAction; target?: CardTarget }
  | { attachesTo: CardTarget }
  | {
      multi: Array<Ability>;
    }
);
