import { CardId, Side, ZoneId } from '@card-engine-nx/basic';

export type Events = {
  onCardMoved?(
    cardId: CardId,
    source: ZoneId,
    destination: ZoneId,
    side: Side
  ): void;
  onError?(message: string): void;
};
