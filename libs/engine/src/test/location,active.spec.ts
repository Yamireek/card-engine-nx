import { it, suite, expect } from 'vitest';
import { TestEngine } from './TestEngine';
import { hero, location, quest } from '@card-engine-nx/state';
import { phaseTravel } from '../round';
import { calculateNumberExpr } from '../expression';

const cards = {
  hero: hero({
    name: 'Hero',
    attack: 1,
    defense: 1,
    willpower: 1,
    hitPoints: 1,
    sphere: 'leadership',
    threatCost: 10,
    traits: [],
  }),
  location: location({
    name: 'Location',
    questPoints: 10,
    threat: 2,
    traits: [],
  }),
  quest: quest({
    name: 'Quest',
    a: {},
    b: {
      questPoints: 10,
    },
    sequence: 1,
  }),
};

suite('Active location', () => {
  it('Travel', () => {
    const game = new TestEngine({
      players: [
        {
          playerArea: [cards.hero],
          hand: [],
          engaged: [],
        },
      ],
      stagingArea: [cards.location],
    });

    const locationCard = game.getCard('Location');

    game.do(phaseTravel);
    expect(game.choiceTitle).toBe('Choose location for travel');
    game.chooseOption('2');
    expect(locationCard.state.zone).toBe('activeLocation');
  });

  it('Only one', () => {
    const game = new TestEngine({
      players: [
        {
          playerArea: [cards.hero],
          hand: [],
          engaged: [],
        },
      ],
      activeLocation: [cards.location],
      stagingArea: [cards.location],
    });

    game.do(phaseTravel);
    expect(game.choiceTitle).toBeUndefined();
  });

  it('No thread', () => {
    const game = new TestEngine({
      players: [
        {
          playerArea: [],
          hand: [],
          engaged: [],
        },
      ],
      activeLocation: [cards.location],
      stagingArea: [cards.location],
    });

    const totalThreat = calculateNumberExpr('totalThreat', game.ctx, []);

    expect(totalThreat).toBe(2);
  });

  it('Replaces quest progress', () => {
    const game = new TestEngine({
      players: [
        {
          playerArea: [cards.hero],
          hand: [],
          engaged: [],
        },
      ],
      stagingArea: [cards.location],
      questArea: [cards.quest],
    });

    const locationCard = game.getCard('Location');
    const questCard = game.getCard('Quest');

    game.do({ placeProgress: 5 });
    expect(questCard.token.progress).toBe(5);
    expect(locationCard.token.progress).toBe(0);
    game.do(phaseTravel);
    game.chooseOption('2');
    game.do({ placeProgress: 2 });
    expect(questCard.token.progress).toBe(5);
    expect(locationCard.token.progress).toBe(2);
  });

  it('Quest progress after explored', () => {
    const game = new TestEngine({
      players: [
        {
          playerArea: [cards.hero],
          hand: [],
          engaged: [],
        },
      ],
      activeLocation: [cards.location],
      questArea: [cards.quest],
    });

    const locationCard = game.getCard('Location');
    const questCard = game.getCard('Quest');

    game.do({ placeProgress: 15 });
    expect(questCard.token.progress).toBe(5);
    expect(locationCard.token.progress).toBe(0);
    expect(locationCard.state.zone).toBe('discardPile');
  });
});
