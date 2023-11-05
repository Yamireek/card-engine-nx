import { CardId, Side, ZoneId } from '@card-engine-nx/basic';

export type UiEvent =
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

export const consoleEvents: UIEvents = {
  send(event) {
    const { type, ...rest } = event;
    console.log(type, rest);
  },
  subscribe() {
    return () => {
      return;
    };
  },
};

export const emptyEvents: UIEvents = {
  send() {
    return;
  },
  subscribe() {
    return () => {
      return;
    };
  },
};
