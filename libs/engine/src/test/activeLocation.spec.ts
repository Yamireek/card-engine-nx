import { it, expect } from 'vitest';
import { TestEngine } from './TestEngine';
import { location } from '@card-engine-nx/state';
import { phaseTravel } from '../round';

const locationCardDef = location({
  name: 'Location',
  questPoints: 10,
  threat: 2,
  traits: [],
});

it('Travel to location', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [],
        hand: [],
        engaged: [],
      },
    ],
    stagingArea: [locationCardDef],
  });

  const locationCard = game.getCard('Location');

  game.do(phaseTravel);
  expect(game.choiceTitle).toBe('Choose location for travel');
  game.chooseOption('1');
  expect(locationCard.state.zone).toBe('activeLocation');
});

it('One active location', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [],
        hand: [],
        engaged: [],
      },
    ],
    activeLocation: [locationCardDef],
    stagingArea: [locationCardDef],
  });

  game.do(phaseTravel);
  expect(game.choiceTitle).toBe('End travel phase');
});

it('No thread as active');

it('Replaces quest progress');

it('Quest progress after explored');
