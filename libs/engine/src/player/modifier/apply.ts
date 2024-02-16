import {
  PlayerModifier,
  PlayerView,
  mergePlayerRules,
} from '@card-engine-nx/state';

export function applyPlayerModifier(
  player: PlayerView,
  modifier: PlayerModifier
) {
  if ('rules' in modifier) {
    player.rules = mergePlayerRules(player.rules, modifier.rules);
    return;
  }

  throw new Error(`unknown player modifier ${JSON.stringify(modifier)}`);
}
