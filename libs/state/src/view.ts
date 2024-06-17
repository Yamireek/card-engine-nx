import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Action } from './action';
import { CardRules, PropertyModifier } from './card';
import { EventType } from './event/type';
import { BoolExpr } from './expression/bool';
import { PlayerRules } from './player';

export type View = {
  cards: Record<
    CardId,
    {
      modifiers: PropertyModifier[];
      rules: CardRules[];
    }
  >;
  players: Partial<Record<PlayerId, PlayerRules[]>>;
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
