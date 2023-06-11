import {
  CardId,
  CardType,
  GameZoneType,
  Mark,
  Phase,
  PlayerId,
  PlayerZoneType,
  Side,
  Sphere,
  Token,
  ZoneId,
} from '@card-engine-nx/basic';
import { PlayerDeck, Scenario } from './card';

export type ActionResult = 'none' | 'partial' | 'full';

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
      card?: { action: CardAction; taget: CardTarget };
      sequence?: Action[];
      addPlayer?: PlayerDeck;
      loadDeck?: {
        player: PlayerId;
        deck: PlayerDeck;
      };
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
      sequence?: Action[];
      incrementThreat?: NumberExpr;
      payResources?: { amount: number; sphere: Sphere };
      declareAttackers?: CardId;
      chooseCardActions?: {
        title: string;
        target: CardTarget;
        action: CardAction;
        multi: boolean;
        optional: boolean;
      };
      chooseActions?: {
        title: string;
        actions: Array<{ title: string; cardId?: CardId; action: Action }>;
        multi: boolean;
        optional: boolean;
      };
    };

export type CardAction =
  | 'empty'
  | 'ready'
  | 'commitToQuest'
  | 'travel'
  | 'exhaust'
  | 'destroy'
  | {
      dealDamage?: number;
      heal?: number | 'all';
      generateResources?: number;
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
    };

export type Ability = {
  description: string;
  implicit?: boolean;
  selfModifier?: Modifier;
  action?: Action;
  setup?: Action;
  attachesTo?: CardTarget;
};

export type Modifier = {
  increment?: {
    prop: 'attack' | 'defense';
    amount: NumberExpr;
  };
};

export type NumberExpr =
  | number
  | 'countOfPlayers'
  | {
      fromCard?: {
        sum?: true; // TODO min, max, single
        card: CardTarget;
        value: CardNumberExpr;
      };
    };

export type BoolExpr =
  | boolean
  | 'enemiesToEngage'
  | { phase?: Phase; someCard?: CardTarget };

export type CardNumberExpr =
  | number
  | 'threadCost'
  | 'willpower'
  | 'threat'
  | {
      tokens: Token;
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
      owner?: PlayerId;
      and?: CardTarget[];
      not?: CardTarget;
      type?: CardType[]; // TODO single
      top?: ZoneTarget;
      sphere?: Sphere | 'any';
      canExecute?: CardAction;
      controller?: PlayerId;
      mark?: Mark;
      zone?: ZoneId;
    };

export type ZoneTarget = {
  game?: GameZoneType;
  player?: {
    id: PlayerTarget;
    zone: PlayerZoneType;
  };
};

export type PlayerTarget = PlayerId | PlayerId[] | 'each' | 'owner' | 'first';

export type Context = { selfCard?: CardId };
