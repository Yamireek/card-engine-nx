import { CardId, Side, ZoneId } from '@card-engine-nx/basic';
import { UiEvent } from './uiEvents';

const error: (message: string) => UiEvent = (message) => {
  return {
    type: 'error',
    message,
  };
};

const card_moved: (params: {
  cardId: CardId;
  source: ZoneId;
  destination: ZoneId;
  side: Side;
}) => UiEvent = (params) => {
  return {
    type: 'card_moved',
    ...params,
  };
};

export const uiEvent = {
  error,
  card_moved,
};
