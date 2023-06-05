import {
  CardId,
  CardType,
  GameZoneType,
  Mark,
  Phase,
  PlayerId,
  PlayerZoneType,
  Side,
  Token,
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
      setupScenario?: Scenario;
      addToStagingArea?: string;
      beginPhase?: Phase;
      playerActions?: string;
      playAlly?: CardTarget;
      setCardVar?: { name: string; value: CardId | undefined };
      clearMarks?: Mark;
      while?: { condition: BoolExpr; action: Action };
      repeat?: { amount: NumberExpr; action: Action };
    };

export type PlayerAction =
  | 'empty'
  | 'shuffleLibrary'
  | 'resolveEnemyAttacks'
  | 'resolvePlayerAttacks'
  | 'commitCharactersToQuest'
  | 'engagementCheck'
  | 'optionalEngagement'
  | { draw?: number; sequence?: Action[]; incrementThreat?: NumberExpr };

export type CardAction =
  | 'empty'
  | 'ready'
  | {
      dealDamage?: number;
      heal?: number;
      generateResources?: number;
      sequence?: Action[];
      flip?: Side;
    };

export type Ability = {
  description: string;
  implicit?: boolean;
  selfModifier?: Modifier;
  action?: Action;
  setup?: Action;
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
        sum?: true;
        card: CardTarget;
        value: CardNumberExpr;
      };
    };

export type BoolExpr = boolean | 'enemiesToEngage';

export type CardNumberExpr =
  | number
  | 'threadCost'
  | {
      tokens: Token;
    };

export type CardTarget =
  | 'self'
  | 'each'
  | 'inAPlay'
  | {
      owner?: PlayerId;
      and?: CardTarget[];
      type?: CardType[];
      top?: ZoneTarget;
    };

export type ZoneTarget = {
  game?: GameZoneType;
  player?: {
    id: PlayerTarget;
    zone: PlayerZoneType;
  };
};

export type PlayerTarget = PlayerId | 'each' | 'owner';

export type Context = { selfCard?: CardId };
