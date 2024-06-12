import { it, expect } from 'vitest';
import { enemy, hero } from '@card-engine-nx/state';
import { TestEngine } from './TestEngine';

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

it('First player token', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [cards.hero],
        engaged: [cards.enemy],
      },
      {
        playerArea: [cards.hero],
      },
    ],
  });

  expect(game.state.firstPlayer).toBe('0');
  expect(game.getPlayer('first').id).toBe('0');
  game.execute('passFirstPlayerToken');
  expect(game.state.firstPlayer).toBe('1');
  game.execute('passFirstPlayerToken');
  expect(game.state.firstPlayer).toBe('0');
});

it('Eliminate player', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [cards.hero],
        engaged: [cards.enemy],
      },
      {
        playerArea: [cards.hero],
      },
    ],
  });

  game.do({ player: '0', action: 'eliminate' });
  expect(game.state.players[0]?.eliminated).toBe(true);
  expect(game.state.players[0]?.zones.playerArea.cards.length).toBe(0);
  expect(game.state.zones.stagingArea.cards.length).toBe(1);
  expect(game.state.firstPlayer).toBe('1');
});
