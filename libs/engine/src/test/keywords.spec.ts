import { enemy } from '@card-engine-nx/state';
import { it, suite, expect } from 'vitest';
import { TestEngine } from './TestEngine';

const cards = {
  enemy: enemy({
    name: 'enemy',
    engagement: 20,
    hitPoints: 1,
    threat: 0,
    traits: [],
    attack: 1,
    defense: 1,
  }),
  surge: enemy({
    name: 'enemy',
    engagement: 20,
    hitPoints: 1,
    threat: 0,
    traits: [],
    attack: 1,
    defense: 1,
    keywords: {
      surge: true,
    },
  }),
};

suite.todo('Doomed X');

suite.todo('Guarded');

suite.todo('Permanent');

suite.todo('Ranged');

suite.todo('Restricted');

suite.todo('Sentinel');

it('Surge', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [],
        hand: [],
        engaged: [],
      },
    ],
    encounterDeck: [cards.enemy, cards.surge],
  });

  game.do('revealEncounterCard');
  expect(game.state.zones.encounterDeck.cards.length).toEqual(0);
});

suite.todo('Victory');

it.todo('Stacking');
