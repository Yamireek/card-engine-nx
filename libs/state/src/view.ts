import { CardId, PlayerId } from '@card-engine-nx/basic';
import { EventType } from './event/type';
import { BoolExpr } from './expression/bool';
import { Action } from './action';
import { CardView } from './card/view';
import { PlayerView } from './player/view';
import { GameModifierState } from './modifier/state';
import { UserCardAction } from './card/ability/action';

export type View = {
  cards: Record<CardId, CardView>;
  players: Partial<Record<PlayerId, PlayerView>>;
  setup: Action[]; // TODO move to cards
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
