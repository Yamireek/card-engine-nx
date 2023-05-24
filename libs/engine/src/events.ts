import { CardId, Side } from '@card-engine-nx/basic';
import { ZoneId } from './player/action';

export type Events = {
  cardMoved?(
    cardId: CardId,
    source: ZoneId,
    destination: ZoneId,
    side: Side
  ): void;
};
