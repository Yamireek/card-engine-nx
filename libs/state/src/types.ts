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
import { Event, PendingEffect } from './state';
import { PlayerModifier } from './view';

export type ActionResult = 'none' | 'partial' | 'full';

export type Limit = 'none' | 'once_per_round';

export type Until = 'end_of_phase' | 'end_of_round';

export type Action =
  | Action[]
  | 'empty'
  | 'shuffleEncounterDeck'
  | 'setup'
  | 'endRound'
  | 'endPhase'
  | 'passFirstPlayerToken'
  | 'resolveQuesting'
  | 'chooseTravelDestination'
  | 'dealShadowCards'
  | 'revealEncounterCard'
  | 'win'
  | 'stackPop'
  | {
      player?: { action: PlayerAction; target: PlayerTarget };
      card?: { action: CardAction; target: CardTarget };
      addPlayer?: PlayerDeck;
      setupScenario?: Scenario;
      beginPhase?: Phase;
      playerActions?: string;
      setCardVar?: { name: string; value: CardId | undefined };
      setPlayerVar?: { name: string; value: PlayerId | undefined };
      useCardVar?: {
        name: string;
        value: CardId;
        action: Action;
      };
      usePlayerVar?: {
        name: string;
        value: PlayerId;
        action: Action;
      };
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
      event?: Event | 'none';
      resolveAttack?: {
        attackers: CardTarget;
        defender: CardTarget;
      };
      atEndOfPhase?: Action;
      stackPush?: PendingEffect;
      cancel?: 'when.revealed';
    };

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
      setLimit?: { key: string; limit: Limit };
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
      until?: Until;
      useVar?: {
        name: string;
        action: PlayerAction;
      };
      deck?: CardAction;
      card?: {
        target: CardTarget;
        action: CardAction;
      };
    };

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
  | {
      payCost?: CostModifier;
      ready?: 'refresh';
      declareAsDefender?: { attacker: CardId };
      destroy?: { attackers: CardId[] };
      dealDamage?: number | { amount: number; attackers: CardId[] };
      heal?: number | 'all';
      generateResources?: NumberExpr;
      payResources?: number;
      placeProgress?: number;
      flip?: Side;
      engagePlayer?: PlayerId;
      resolveEnemyAttacking?: PlayerId;
      resolvePlayerAttacking?: PlayerId;
      mark?: Mark;
      clear?: Mark;
      attachCard?: CardTarget;
      move?: {
        from?: ZoneId;
        to: ZoneId;
        side: Side;
      };
      modify?: CardModifier | CardModifier[];
      until?: Until;
      setAsVar?: string;
      responses?: Event;
      whenRevealed?: {
        description: string;
        action: Action;
      };
    };

export type PropertyIncrement = Partial<
  Record<
    'attack' | 'defense' | 'willpower' | 'hitPoints' | 'threat',
    NumberExpr
  >
>;

export type Ability = { description: string } & (
  | {
      whenRevealed: Action;
    }
  | {
      action: Action;
      cost?: CostModifier;
      phase?: Phase;
      limit?: 'once_per_round';
    }
  | {
      card: CardModifier;
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
  | { response: ResponseAction; target: CardTarget; cost?: CostModifier }
  | { forced: ResponseAction; target: CardTarget }
  | { attachesTo: CardTarget }
  | {
      multi: Array<Ability>;
    }
  | {
      conditional?: {
        advance?: BoolExpr;
      };
    }
  | { nextStage: 'random' }
);

export type CardModifier = {
  description: string;
  increment?: PropertyIncrement;
  disable?: Mark;
  refreshCost?: CardAction;
  reaction?: {
    event: EventType;
    condition?: BoolExpr;
    action: Action;
    forced: boolean;
  };
  action?: Action;
  whenRevealed?: Action;
  travel?: Action;
  setup?: Action;
  nextStage?: 'random';
  conditional?: {
    advance?: BoolExpr;
  };
  cost?: CostModifier;
  keywords?: Keywords;
  type?: CardType;
  trait?: Trait;
};

export type CostModifier = {
  heroes?: number;
};

export type NextStage = 'default' | 'random';

export type EventType = Exclude<Event, 'none'>['type'];

export type ResponseAction = {
  event: EventType;
  condition?: BoolExpr;
  action: Action;
};

export type NumberExpr =
  | number
  | 'countOfPlayers'
  | {
      count?: {
        cards?: CardTarget;
      };
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
      multiply?: [NumberExpr, NumberExpr];
    };

export type EventNumbers = { type: 'receivedDamage'; value: 'damage' }; // TODO remove type

export type EventBool = { type: 'destroyed'; isAttacker: CardTarget }; // TODO remove type

export type BoolExpr =
  | boolean
  | 'enemiesToEngage'
  | {
      event?: EventBool;
      and?: BoolExpr[];
      not?: BoolExpr;
      phase?: Phase;
      someCard?: CardTarget;
      eq?: [NumberExpr, NumberExpr];
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
  | 'in_a_play'
  | {
      hasTrait?: Trait;
      hasMark?: Mark;
      isType?: CardType | 'character';
      is?: CardTarget;
      name?: string;
      zone?: GameZoneType | PlayerZoneType;
    };

export type CardTarget =
  | 'self'
  | 'each'
  | 'inAPlay'
  | 'character'
  | 'ready'
  | 'event'
  | 'exhausted'
  | 'target'
  | CardId
  | CardId[]
  | {
      name?: string;
      owner?: PlayerId;
      and?: CardTarget[];
      not?: CardTarget;
      type?: CardType | CardType[];
      top?: ZoneTarget | { zone: ZoneTarget; amount: number };
      sphere?: Sphere | 'any';
      controller?: PlayerTarget;
      mark?: Mark;
      enabled?: Mark;
      trait?: Trait;
      zone?: ZoneId;
      zoneType?:
        | PlayerZoneType
        | GameZoneType
        | Array<PlayerZoneType | GameZoneType>;
      sequence?: NumberExpr;
      hasAttachment?: CardTarget;
      keyword?: keyof Keywords;
      var?: string;
      event?: 'attacking';
      take?: number;
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
  | 'event'
  | 'highestThreat'
  | {
      and?: PlayerTarget[];
      controller?: CardId;
      var?: string;
    };

export type Context = { selfCard?: CardId };
