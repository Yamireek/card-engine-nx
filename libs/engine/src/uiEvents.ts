import { CardId, Side, ZoneId } from '@card-engine-nx/basic';
import { State } from '@card-engine-nx/state';

export type UiEvent =
  | { type: 'new_state'; state: State }
  | { type: 'error'; message: string }
  | {
      type: 'card_moved';
      cardId: CardId;
      source: ZoneId;
      destination: ZoneId;
      side: Side;
    };

export type UIEvents = {
  send(event: UiEvent): void;
  subscribe(sub: (event: UiEvent) => void): () => void;
};
