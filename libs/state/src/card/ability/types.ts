import { GameZoneType, Phase, PlayerZoneType } from '@card-engine-nx/basic';
import { PlayerModifier } from '../../player/modifier/types';
import { Action } from '../../action';
import { PlayerTarget } from '../../player/target';
import { CardTarget } from '../target';
import { BoolExpr } from '../../expression/bool';
import { ResponseAction } from '../response';
import { CostModifier } from '../modifier/cost';
import { CardModifier } from '../modifier/type';
import { Limit } from './limit';
import { PropertyIncrement } from '../modifier/increment';

export type Ability = { description: string } & (
  | {
      whenRevealed: Action;
    }
  | { shadow: Action }
  | {
      action: Action;
      cost?: CostModifier;
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
      cost?: CostModifier;
    }
  | { forced: ResponseAction; target?: CardTarget }
  | { attachesTo: CardTarget }
  | {
      multi: Array<Ability>;
    }
  | {
      conditional: {
        advance: BoolExpr;
      };
    }
  | { nextStage: 'random' }
);
