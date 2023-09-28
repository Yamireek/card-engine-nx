import {
  PlayerState,
  PlayerView,
} from '@card-engine-nx/state';
import { cloneDeep } from 'lodash/fp';

export function createPlayerView(state: PlayerState): PlayerView {
  return {
    id: state.id,
    modifiers: state.modifiers.map((m) => ({
      applied: false,
      modifier: cloneDeep(m),
    })),
  };
}
