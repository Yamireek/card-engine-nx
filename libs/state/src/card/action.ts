import { CardId, Mark, PlayerId, Side, Until } from '@card-engine-nx/basic';
import { Action } from '../action';
import { Event } from '../event';
import { NumberExpr } from '../expression/number';
import { PlayerAction } from '../player/action';
import { PlayerTarget } from '../player/target';
import { ZoneTarget } from '../zone/target';
import { CostModifier } from './modifier/cost';
import { CardModifier } from './modifier/type';
import { CardTarget } from './target';

export type CardAction =
  | CardAction[]
  | 'empty'
  | 'travel'
  | 'exhaust'
  | 'reveal'
  | 'shuffleToDeck'
  | 'destroy'
  | 'discard'
  | 'advance'
  | 'draw'
  | 'explore'
  | 'ready'
  | 'commitToQuest'
  | 'resolveShadowEffects'
  | 'resolveShadow'
  | 'moveToBottom'
  | 'moveToTop'
  | 'dealShadowCard'
  | {
      payCost?: CostModifier;
      ready?: 'refresh';
      declareAsDefender?: { attacker: CardId };
      destroy?: { attackers: CardId[] };
      dealDamage?: number | { amount: NumberExpr; attackers?: CardId[] };
      heal?: number | 'all';
      generateResources?: NumberExpr;
      payResources?: NumberExpr;
      placeProgress?: number;
      flip?: Side;
      engagePlayer?: PlayerTarget;
      resolveEnemyAttacking?: PlayerId;
      resolvePlayerAttacking?: PlayerId;
      mark?: Mark;
      clear?: Mark;
      attachCard?: CardTarget;
      move?: {
        from?: ZoneTarget;
        to: ZoneTarget;
        side?: Side;
      };
      modify?: CardModifier | CardModifier[];
      until?: Until;
      responses?: Event;
      whenRevealed?: {
        description: string;
        action: Action;
      };
      putInPlay?: PlayerTarget;
      controller?: PlayerAction;
      setController?: PlayerTarget;
      action?: Action;
    };
