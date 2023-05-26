import { CardId, Side, ZoneId } from '@card-engine-nx/basic';
import { State } from '@card-engine-nx/state';

export type Events = {
  onCardMoved(
    cardId: CardId,
    source: ZoneId,
    destination: ZoneId,
    side: Side
  ): void;
  onError(message: string): void;
  updateUi(newState: State): void;
};
