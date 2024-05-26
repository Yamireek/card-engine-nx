import { TestEngine } from '@card-engine-nx/engine';
import { core } from '../index';
import { it, expect } from 'vitest';

it('Enchanted Stream', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [core.hero.gimli],
        library: [core.ally.beorn],
      },
    ],
    activeLocation: [core.location.enchantedStream],
  });

  game.do({ player: 'each', action: { draw: 1 } });
  const player = game.getPlayer('0');
  expect(player.library.cards).toHaveLength(1);
});
