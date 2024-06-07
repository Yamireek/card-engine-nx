import {
  CardId,
  LimitType,
  Mark,
  Phase,
  Side,
  ZoneId,
} from '@card-engine-nx/basic';
import { CardAction } from './card/action';
import { CardTarget } from './card/target';
import { Choice } from './choice';
import { PlayerDeck } from './deck/player';
import { Scenario } from './deck/scenario';
import { CardDefinition } from './definitions';
import { StackEffect } from './effect';
import { Event } from './event';
import { BoolExpr } from './expression/bool';
import { NumberExpr } from './expression/number';
import { PlayerAction } from './player/action';
import { PlayerTarget } from './player/target';
import { ScopeAction } from './scope/action';

export type Action =
  | Action[]
  | 'endScope'
  | 'empty'
  | 'shuffleEncounterDeck'
  | 'setup'
  | 'endRound'
  | 'endPhase'
  | 'passFirstPlayerToken'
  | 'sendCommitedEvents'
  | 'resolveQuesting'
  | 'chooseTravelDestination'
  | 'dealShadowCards'
  | 'revealEncounterCard'
  | 'win'
  | 'loose'
  | 'stackPop'
  | 'stateCheck'
  | 'surge++'
  | 'surge--'
  | { useScope: ScopeAction; action: Action }
  | {
      player: PlayerTarget;
      action: PlayerAction;
      scooped?: boolean;
    }
  | {
      card: CardTarget;
      action: CardAction;
      scooped?: boolean;
    }
  | {
      addPlayer?: PlayerDeck;
      addCard?: {
        definition: CardDefinition;
        zone: ZoneId;
        side: Side;
        resources?: number;
        progress?: number;
        damage?: number;
        exhausted?: boolean;
        attachments?: CardDefinition[];
      };
      setupScenario?: {
        scenario: Scenario;
        difficulty: 'easy' | 'normal';
      };
      beginPhase?: Phase;
      playerActions?: string;
      choice?: Choice;
      clearMarks?: Mark;
      while?: { condition: BoolExpr; action: Action };
      repeat?: { amount: NumberExpr; action: Action };
      placeProgress?: number;
      payment?: {
        cost: Action;
        effect: Action;
      };
      chooseRandomCardForAction?: {
        target: CardTarget;
        action: CardAction;
      };
      useLimit?: {
        card: CardId;
        max: number;
        type: LimitType;
      };
      event?: Event | 'none';
      resolveAttack?: {
        attackers: CardTarget;
        defender: CardTarget;
      };
      atEndOfPhase?: Action;
      stackPush?: StackEffect;
      cancel?: 'when.revealed' | 'shadow';
      if?: {
        condition: BoolExpr;
        true?: Action;
        false?: Action;
      };
    };
