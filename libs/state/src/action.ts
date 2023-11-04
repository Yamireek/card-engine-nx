import { CardId, LimitType, Mark, Phase } from '@card-engine-nx/basic';
import { Scenario } from './deck/scenario';
import { PlayerDeck } from './deck/player';
import { PendingEffect } from './effect';
import { Choice } from './choice';
import { Event } from './event';
import { NumberExpr } from './expression/number';
import { BoolExpr } from './expression/bool';
import { CardTarget } from './card/target';
import { PlayerTarget } from './player/target';
import { CardAction } from './card/action';
import { PlayerAction } from './player/action';
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
  | 'incX'
  | 'clearX'
  | { useScope: ScopeAction; action: Action }
  | {
      player: PlayerTarget;
      action: PlayerAction;
      scooped?: boolean;
    }
  | {
      card: CardTarget;
      action: CardAction;
    }
  | {
      player?: { action: PlayerAction; target: PlayerTarget }; // TODO remove
      card?: { action: CardAction; target: CardTarget }; // TODO remove
      addPlayer?: PlayerDeck;
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
      stackPush?: PendingEffect;
      cancel?: 'when.revealed' | 'shadow';
      if?: {
        condition: BoolExpr;
        true?: Action;
        false?: Action;
      };
    };
