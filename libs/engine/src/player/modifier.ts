import { PlayerModifier, PlayerView } from '@card-engine-nx/state';

export function applyPlayerModifier(
  player: PlayerView,
  modifier: PlayerModifier
) {
  if (modifier === 'can_declate_multiple_defenders') {
    player.multipleDefenders = true;
    return;
  }

  if (modifier === 'disable_draw') {
    player.disableDraw = true;
    return;
  }

  throw new Error(`unknown player modifier ${JSON.stringify(modifier)}`);
}
