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
import { Choice, Event, PendingEffect, State } from './state';
import { CardRules, PlayerModifier } from './view';

export type ActionResult = 'none' | 'partial' | 'full';

export type LimitType = 'round' | 'phase';
export type Limit = { type: LimitType; max: number };

export type Until = 'end_of_phase' | 'end_of_round';

export type Action =
  | Action[]
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
  | {
      player: PlayerTarget;
      action: PlayerAction;
    }
  | {
      card: CardTarget;
      action: CardAction;
    }
  | {
      player?: { action: PlayerAction; target: PlayerTarget };
      card?: { action: CardAction; target: CardTarget };
      addPlayer?: PlayerDeck;
      setupScenario?: {
        scenario: Scenario;
        difficulty: 'easy' | 'normal';
      };
      beginPhase?: Phase;
      playerActions?: string;
      choice?: Choice;
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
      payResources?: { amount: number; sphere: Sphere[]; heroes?: number };
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
      engaged?: CardAction;
      controlled?: CardAction;
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
  | 'commitToQuest'
  | 'resolveShadowEffects'
  | 'resolveShadow'
  | {
      payCost?: CostModifier;
      ready?: 'refresh';
      declareAsDefender?: { attacker: CardId };
      destroy?: { attackers: CardId[] };
      dealDamage?: number | { amount: NumberExpr; attackers?: CardId[] };
      heal?: number | 'all';
      generateResources?: NumberExpr;
      payResources?: number;
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
      putInPlay?: PlayerTarget;
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
      target: CardTarget;
      zone?: GameZoneType | PlayerZoneType;
      cost?: CostModifier;
    }
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
  if?: {
    condition: CardBoolExpr;
    modifier: CardModifier;
  };
  addSphere?: Sphere;
  rule?: CardRules;
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
  | 'totalThreat'
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
  | 'undefended.attack'
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
      global?: BoolExpr;
      predicate?: CardTarget;
      and?: CardBoolExpr[];
    };

export type SimpleCardTarget =
  | 'self'
  | 'each'
  | 'inAPlay'
  | 'character'
  | 'ready'
  | 'event'
  | 'exhausted'
  | 'target'
  | 'destroyed'
  | 'explored';

export type CardTarget =
  | SimpleCardTarget
  | CardId
  | CardId[]
  | {
      name?: string;
      owner?: PlayerTarget;
      simple?: SimpleCardTarget | SimpleCardTarget[];
      and?: CardTarget[]; // TODO remove
      not?: CardTarget;
      type?: CardType | CardType[];
      top?:
        | ZoneTarget
        | { zone: ZoneTarget; amount: number; filter?: CardTarget };
      sphere?: Sphere | Sphere[] | 'any';
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
      attachmentOf?: CardTarget;
      hasShadow?: CardTarget;
      keyword?: keyof Keywords;
      var?: string;
      event?: 'attacking';
      take?: number;
      side?: Side;
      shadows?: CardTarget;
    };

export type ZoneTarget =
  | GameZoneType
  | {
      player: PlayerTarget;
      type: PlayerZoneType;
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
  | 'target'
  | 'defending'
  | {
      and?: PlayerTarget[];
      controllerOf?: CardTarget;
      var?: string;
    };

export type Context = { selfCard?: CardId };
