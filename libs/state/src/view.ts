import {
  CardId,
  CardNumProp,
  CardType,
  PlayerId,
  Trait,
} from '@card-engine-nx/basic';
import { Action } from './action';
import { CardRules } from './card';
import { EventType } from './event/type';
import { BoolExpr } from './expression/bool';
import { PlayerRules } from './player';

export type CardPropsModifier =
  | { rule: CardRules }
  | { set: { type: CardType } }
  | { add: { trait?: Trait | Trait[] } }
  | { inc: Partial<Record<CardNumProp, number>> };

export type View = {
  cards: Record<CardId, CardPropsModifier[]>;
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
