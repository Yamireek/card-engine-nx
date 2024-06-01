import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Action } from './action';
import { UserCardAction } from './card/ability/action';
import { CardView } from './card/view';
import { EventType } from './event/type';
import { BoolExpr } from './expression/bool';
import { GameModifierState } from './modifier/state';
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
