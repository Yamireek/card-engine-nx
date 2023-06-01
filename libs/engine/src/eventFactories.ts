import { CardId, Side, ZoneId } from '@card-engine-nx/basic';
import { State } from '@card-engine-nx/state';
import { UiEvent } from './uiEvents';

const newState: (state: State) => UiEvent = (state) => {
  return {
    type: 'new_state',
    state,
  };
};

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
  newState,
  error,
  card_moved,
};
