import {
  CardId,
  CardType,
  GameZoneType,
  Keywords,
  Mark,
  Phase,
  PlayerId,
  PlayerZoneType,
  Side,
  Sphere,
  Token,
  Trait,
  ZoneId,
} from '@card-engine-nx/basic';
import { PlayerDeck, Scenario } from './card';
import { Event } from './state';
import { PlayerModifier } from './view';

export type ActionResult = 'none' | 'partial' | 'full';

export type Limit = 'none' | 'once_per_round';

export type Until = 'end_of_phase' | 'end_of_round';

export type Action =
  | 'empty'
  | 'shuffleEncounterDeck'
  | 'executeSetupActions'
  | 'endRound'
  | 'endPhase'
  | 'passFirstPlayerToken'
  | 'resolveQuesting'
  | 'chooseTravelDestination'
  | 'dealShadowCards'
  | 'revealEncounterCard'
  | {
      player?: { action: PlayerAction; target: PlayerTarget };
      card?: { action: CardAction; target: CardTarget };
      sequence?: Action[];
      addPlayer?: PlayerDeck;
      setupScenario?: Scenario;
      addToStagingArea?: string;
      beginPhase?: Phase;
      playerActions?: string;
      setCardVar?: { name: string; value: CardId | undefined };
      setPlayerVar?: { name: string; value: PlayerId | undefined };
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
        type: Limit;
        card: CardId;
        index: number;
      };
      setEvent?: Event;
      resolveAttack?: {
        attackers: CardTarget;
        defender: CardTarget;
      };
      atEndOfPhase?: Action;
    };

export type PlayerAction =
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
      discard?: number;
      setLimit?: { key: string; limit: Limit };
      sequence?: PlayerAction[];
      incrementThreat?: NumberExpr;
      payResources?: { amount: number; sphere: Sphere; heroes?: number };
      declareAttackers?: CardId;
      chooseCardActions?: {
        title: string;
        target: CardTarget;
        action: CardAction;
        multi: boolean;
        optional: boolean;
      };
      choosePlayerActions?: {
        title: string;
        target: PlayerTarget;
        action: PlayerAction;
        multi: boolean;
        optional: boolean;
      };
      chooseActions?: {
        title: string;
        actions: Array<{ title: string; cardId?: CardId; action: Action }>;
        multi: boolean;
        optional: boolean;
      };
      engaged?: CardAction;
      modify?: PlayerModifier;
    };

export type CardAction =
  | 'empty'
  | 'ready'
  | 'travel'
  | 'exhaust'
  | 'destroy'
  | 'reveal'
  | 'shuffleToDeck'
  | {
      dealDamage?: number;
      heal?: number | 'all';
      generateResources?: NumberExpr;
      payResources?: number;
      sequence?: CardAction[];
      placeProgress?: number;
      flip?: Side;
      engagePlayer?: PlayerId;
      resolveEnemyAttacking?: PlayerId;
      resolvePlayerAttacking?: PlayerId;
      mark?: Mark;
      attachCard?: CardId;
      move?: {
        from?: ZoneId;
        to: ZoneId;
        side: Side;
      };
      modify?: Modifier | Modifier[];
      until?: Until;
      setAsVar?: string;
    };

export type PropertyBonus = {
  property: 'attack' | 'defense' | 'willpower' | 'hitPoints';
  amount: NumberExpr;
};

export type Modifier = {
  description: string;
  implicit?: boolean;
  phase?: Phase;
  action?: Action;
  setup?: Action;
  attachesTo?: CardTarget;
  limit?: 'once_per_round';
  response?: ActionResponse;
  payment?: PaymentConditions;
  bonus?: PropertyBonus;
  target?: CardTarget;
  disable?: Mark;
  until?: Until;
  nextStage?: 'random';
};

export type PaymentConditions = {
  heroes?: number;
};

export type NextStage = 'default' | 'random';

export type ActionResponse = {
  event: 'receivedDamage';
  action: Action;
};

export type EventNumbers = { type: 'receivedDamage'; value: 'damage' };

export type NumberExpr =
  | number
  | 'countOfPlayers'
  | {
      card?: {
        sum?: true;
        target: CardTarget;
        value: CardNumberExpr;
      };
      event?: EventNumbers;
      plus?: NumberExpr[];
      if?: {
        cond: BoolExpr;
        true: NumberExpr;
        false: NumberExpr;
      };
    };

export type BoolExpr =
  | boolean
  | 'enemiesToEngage'
  | {
      and?: BoolExpr[];
      phase?: Phase;
      someCard?: CardTarget;
      card?: {
        target: CardTarget;
        value: CardBoolExpr;
      };
    };

export type CardNumberExpr =
  | number
  | 'threadCost'
  | 'willpower'
  | 'threat'
  | 'sequence'
  | {
      tokens: Token;
    };

export type CardBoolExpr =
  | boolean
  | {
      hasTrait?: Trait;
      hasMark?: Mark;
    };

export type CardTarget =
  | 'self'
  | 'each'
  | 'inAPlay'
  | 'character'
  | 'ready'
  | CardId
  | CardId[]
  | {
      name?: string;
      owner?: PlayerId;
      and?: CardTarget[];
      not?: CardTarget;
      type?: CardType;
      top?: ZoneTarget;
      sphere?: Sphere | 'any';
      canExecute?: CardAction;
      controller?: PlayerTarget;
      mark?: Mark;
      enabled?: Mark;
      trait?: Trait;
      zone?: ZoneId;
      zoneType?: PlayerZoneType | GameZoneType;
      sequence?: NumberExpr;
      hasAttachment?: CardTarget;
      keyword?: keyof Keywords;
      var?: string;
    };

export type ZoneTarget = {
  game?: GameZoneType;
  player?: {
    id: PlayerTarget;
    zone: PlayerZoneType;
  };
};

export type PlayerTarget =
  | PlayerId
  | PlayerId[]
  | 'each'
  | 'owner'
  | 'controller'
  | 'first'
  | 'next'
  | { and?: PlayerTarget[]; canExecute?: PlayerAction; controller?: CardId };

export type Context = { selfCard?: CardId };
