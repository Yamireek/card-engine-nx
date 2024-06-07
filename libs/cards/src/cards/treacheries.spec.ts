import { it, expect } from 'vitest';
import { TestEngine } from '@card-engine-nx/engine';
import { core } from '../index';

it('Caught in a Web', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [{ card: core.hero.gimli, exhausted: true, resources: 2 }],
      },
    ],
    encounterDeck: [core.treachery.caughtInAWeb],
  });

  const gimli = game.card('Gimli');
  const treatchery = game.card('Caught in a Web');
  game.do('revealEncounterCard');
  expect(gimli.state.attachments).toHaveLength(1);
  gimli.execute({ ready: 'refresh' });
  game.chooseOption('Yes');
  expect(gimli.state.token.resources).toBe(0);
  expect(gimli.state.tapped).toBe(false);
  treatchery.execute('discard');
  expect(game.state.modifiers).toHaveLength(0);
});
