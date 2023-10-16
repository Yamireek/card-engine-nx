import { core } from '@card-engine-nx/cards';
import { TestEngine } from '../../../../libs/engine/src/TestEngine';
import { it, expect } from 'vitest';

it('Caught in a Web', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [{ card: core.hero.gimli, exhausted: true, resources: 2 }],
      },
    ],
    encounterDeck: [core.treachery.caughtInAWeb],
  });

  const gimli = game.getCard('Gimli');
  const treatchery = game.getCard('Caught in a Web');
  game.do('revealEncounterCard');
  expect(gimli.state.attachments).toHaveLength(1);
  gimli.update({ ready: 'refresh' });
  game.chooseOption('Yes');
  expect(gimli.state.token.resources).toBe(0);
  expect(gimli.state.tapped).toBe(false);
  treatchery.update('discard');
  expect(game.state.modifiers).toHaveLength(0);
});
