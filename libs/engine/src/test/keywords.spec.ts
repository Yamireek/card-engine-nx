import { it, suite, expect } from 'vitest';
import { ally, enemy, hero, location } from '@card-engine-nx/state';
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
    name: 'surge enemy',
    engagement: 20,
    hitPoints: 1,
    threat: 0,
    traits: [],
    attack: 1,
    defense: 1,
    keywords: {
      surge: 1,
    },
  }),
  doomed: location({
    name: 'location',
    questPoints: 1,
    threat: 1,
    traits: [],
    keywords: { doomed: 2 },
  }),
  ranged: hero({
    name: 'ranged hero',
    threatCost: 10,
    attack: 1,
    defense: 1,
    willpower: 1,
    hitPoints: 1,
    sphere: 'leadership',
    traits: [],
    keywords: { ranged: true },
  }),
  sentinel: hero({
    name: 'sentinel hero',
    threatCost: 10,
    attack: 1,
    defense: 1,
    willpower: 1,
    hitPoints: 1,
    sphere: 'leadership',
    traits: [],
    keywords: { sentinel: true },
  }),
  victory: enemy({
    name: 'enemy',
    engagement: 20,
    hitPoints: 1,
    threat: 0,
    traits: [],
    attack: 1,
    defense: 1,
    keywords: {
      surge: 1,
    },
    victory: 5,
  }),
};

it('Doomed X', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [],
        hand: [],
        engaged: [],
      },
    ],
    encounterDeck: [cards.doomed],
  });

  game.do('revealEncounterCard');
  expect(game.state.players['0']?.thread).toEqual(2);
});

suite.todo('Guarded');

it('Ranged', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [cards.ranged],
        engaged: [],
      },
      {
        playerArea: [cards.ranged],
        engaged: [cards.enemy],
      },
    ],
    encounterDeck: [cards.doomed],
  });

  game.do({ player: '0', action: 'resolvePlayerAttacks' });
  game.chooseOption('1');
});

suite.todo('Restricted');

it('Sentinel', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [cards.sentinel],
        engaged: [],
      },
      {
        playerArea: [cards.sentinel],
        engaged: [cards.enemy],
      },
    ],
    encounterDeck: [cards.doomed],
  });

  game.do({ player: '1', action: 'resolveEnemyAttacks' });
  game.chooseOption('1');
});

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

it('Victory', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [cards.sentinel],
        engaged: [],
      },
      {
        playerArea: [cards.sentinel],
        engaged: [cards.victory],
      },
    ],
  });

  const enemy = game.card('enemy');
  enemy.execute({ dealDamage: 5 });
  expect(enemy.zone.type).toBe('victoryDisplay');
});


it('Stacking', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [],
        hand: [],
        engaged: [],
      },
    ],
    encounterDeck: [cards.enemy, cards.enemy, cards.surge],
  });

  game.state.modifiers.push({
    source: 0,
    card: { name: 'surge enemy' },
    modifier: { add: { keyword: { surge: 1 } } },
  });
  game.do('revealEncounterCard');
  expect(game.state.zones.encounterDeck.cards.length).toEqual(0);
});
