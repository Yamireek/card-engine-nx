import { PlayerState, PlayerView } from '@card-engine-nx/state';

export function createPlayerView(state: PlayerState): PlayerView {
  return {
    id: state.id,
    rules: {},
  };
}
