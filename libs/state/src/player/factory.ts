import { PlayerId } from '@card-engine-nx/basic';
import { PlayerState } from './state';

export function createPlayerState(playerId: PlayerId): PlayerState {
  return {
    id: playerId,
    thread: 0,
    zones: {
      hand: { cards: [] },
      library: { cards: [] },
      playerArea: { cards: [] },
      discardPile: { cards: [] },
      engaged: { cards: [] },
    },
    flags: {},
    eliminated: false,
    limits: {},
    view: {
      id: playerId,
      rules: {},
    },
  };
}
