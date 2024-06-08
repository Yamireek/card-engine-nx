import {
  CardId,
  CardNumProp,
  CardType,
  PlayerId,
  Trait,
} from '@card-engine-nx/basic';
import { Action } from './action';
import { CardRules } from './card';
import { UserCardAction } from './card/ability/action';
import { CardView } from './card/view';
import { EventType } from './event/type';
import { BoolExpr } from './expression/bool';
import { GameModifierState } from './modifier/state';
import { PlayerRules } from './player';
import { PlayerView } from './player/view';

export type View = {
  cards: Record<CardId, CardView>;
  players: Partial<Record<PlayerId, PlayerView>>;
  actions: UserCardAction[];
  modifiers: GameModifierState[];
  responses: Partial<
    Record<
      EventType,
      Array<{
        source: CardId;
        card: CardId;
        description: string;
        condition?: BoolExpr;
        action: Action;
        forced: boolean;
      }>
    >
  >;
};

export type CardStateModifier =
  | {
      property: CardNumProp;
      increment: number;
    }
  | { rule: CardRules }
  | { set: { type: CardType } }
  | { add: { trait?: Trait | Trait[] } };

export type StateModifiers = {
  cards: Record<CardId, CardStateModifier[]>;
  players: Partial<Record<PlayerId, PlayerRules>>;
  actions: Array<{ source: CardId; description: string; action: Action }>;
  responses: Partial<
    Record<
      EventType,
      Array<{
        source: CardId;
        cards: CardId[];
        description: string;
        condition?: BoolExpr;
        action: Action;
        forced: boolean;
      }>
    >
  >;
};
