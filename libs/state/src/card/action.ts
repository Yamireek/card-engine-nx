import { CardId, Mark, PlayerId, Side, Until } from '@card-engine-nx/basic';
import { Event } from '../event';
import { Action } from '../action';
import { PlayerAction } from '../player/action';
import { CardModifier } from './modifier/type';
import { CostModifier } from './modifier/cost';
import { NumberExpr } from '../expression/number';
import { CardTarget } from './target';
import { ZoneTarget } from '../zone/target';
import { PlayerTarget } from '../player/target';

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
