import { CardId, Sphere, Until } from '@card-engine-nx/basic';
import { PlayerModifier } from './modifier/types';
import { Action } from '../action';
import { Limit } from '../card/ability/limit';
import { NumberExpr } from '../expression/number';
import { CardTarget } from '../card/target';
import { PlayerTarget } from './target';
import { CardAction } from '../card/action';

export type PlayerAction =
  | PlayerAction[]
  | 'empty'
  | 'shuffleLibrary'
  | 'resolveEnemyAttacks'
  | 'resolvePlayerAttacks'
  | 'commitCharactersToQuest'
  | 'engagementCheck'
  | 'optionalEngagement'
  | 'declareDefender'
  | 'determineCombatDamage'
  | 'eliminate'
  | {
      draw?: number;
      discard?: {
        amount: number;
        target: 'choice' | 'random';
      };
      useLimit?: { key: string; limit: Limit };
      incrementThreat?: NumberExpr;
      payResources?: {
        amount: NumberExpr;
        sphere: Sphere | Sphere[];
        needHeroes?: number;
      };
      declareAttackers?: CardId;
      chooseCardActions?: {
        title: string;
        target: CardTarget;
        action: CardAction;
        multi?: boolean;
        optional?: boolean;
      };
      choosePlayerActions?: {
        title: string;
        target: PlayerTarget;
        action: PlayerAction;
        multi?: boolean;
        optional?: boolean;
      };
      chooseActions?: {
        title: string;
        actions: Array<{ title: string; cardId?: CardId; action: Action }>;
        multi?: boolean;
        optional?: boolean;
      };
      chooseX?: {
        min: NumberExpr;
        max: NumberExpr;
        action: Action;
      };
      engaged?: CardAction;
      controlled?: CardAction;
      modify?: PlayerModifier;
      until?: Until;
      deck?: CardAction;
      card?: {
        target: CardTarget;
        action: CardAction;
      };
      player?: {
        target: PlayerTarget;
        action: PlayerAction;
        scooped?: boolean;
      };
    };
