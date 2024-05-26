import { it, suite, expect } from 'vitest';
import { TestEngine } from './TestEngine';
import { enemy, hero } from '@card-engine-nx/state';

const cards = {
  hero: hero({
    name: 'hero',
    attack: 1,
    defense: 1,
    willpower: 1,
    hitPoints: 1,
    sphere: 'leadership',
    threatCost: 10,
    traits: [],
  }),
  enemy: enemy({
    name: 'enemy',
    engagement: 20,
    attack: 1,
    defense: 1,
    hitPoints: 1,
    threat: 0,
    traits: [],
  }),
};

suite('First player', () => {
  it.todo('Get first player');

  it.todo('Pass token');

  it.todo('Eliminate first player');
});

it.todo('Player order');

it('Eliminate player', () => {
  const game = new TestEngine(
    {
      players: [
        {
          playerArea: [cards.hero],
          engaged: [cards.enemy],
        },
        {
          playerArea: [cards.hero],
        },
      ],
    },
    {
      console: true,
    }
  );

  game.do({ player: '0', action: 'eliminate' });
  expect(game.state.players[0]?.eliminated).toBe(true);
  expect(game.state.players[0]?.zones.playerArea.cards.length).toBe(0);
  expect(game.state.zones.stagingArea.cards.length).toBe(1);
});
