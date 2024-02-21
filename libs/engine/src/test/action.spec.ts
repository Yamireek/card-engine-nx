import { it, expect } from 'vitest';
import { TestEngine } from './TestEngine';
import {
  hero,
  Ability,
  event,
  ally,
  attachment,
  quest,
  location,
} from '@card-engine-nx/state';

const drawAbility: Ability = {
  description: 'Draw 1 card',
  action: {
    player: 'each',
    action: {
      draw: 1,
    },
  },
};

const emptyCard = event({ name: 'Empty', cost: 0, sphere: 'leadership' });

it('Hero action', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: hero(
              {
                name: 'Hero',
                willpower: 1,
                attack: 1,
                defense: 1,
                hitPoints: 1,
                sphere: 'leadership',
                threatCost: 10,
                traits: [],
              },
              drawAbility
            ),
          },
        ],
        library: [emptyCard],
      },
    ],
  });

  expect(game.actions).toHaveLength(1);
  expect(game.actions[0].description).toBe(drawAbility.description);
});

it('Ally action', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: ally(
              {
                name: 'Ally',
                willpower: 1,
                attack: 1,
                defense: 1,
                hitPoints: 1,
                sphere: 'leadership',
                traits: [],
                cost: 1,
                unique: false,
              },
              drawAbility
            ),
          },
        ],
        library: [emptyCard],
      },
    ],
  });

  expect(game.actions).toHaveLength(1);
  expect(game.actions[0].description).toBe(drawAbility.description);
});

it('Attachment action', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: ally({
              name: 'Ally',
              willpower: 1,
              attack: 1,
              defense: 1,
              hitPoints: 1,
              sphere: 'leadership',
              traits: [],
              cost: 1,
              unique: false,
            }),
            attachments: [
              attachment(
                {
                  name: 'Attachment',
                  cost: 1,
                  sphere: 'leadership',
                  traits: [],
                  unique: false,
                },
                drawAbility
              ),
            ],
          },
        ],
        library: [emptyCard],
      },
    ],
  });

  expect(game.actions).toHaveLength(1);
  expect(game.actions[0].description).toBe(drawAbility.description);
});

it('Event action', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: ally({
              name: 'Ally',
              willpower: 1,
              attack: 1,
              defense: 1,
              hitPoints: 1,
              sphere: 'leadership',
              traits: [],
              cost: 1,
              unique: false,
            }),
          },
        ],
        library: [emptyCard],
        hand: [
          event({ name: 'Event', cost: 0, sphere: 'leadership' }, drawAbility),
        ],
      },
    ],
  });

  expect(game.actions).toHaveLength(1);
  expect(game.actions[0].description).toBe(drawAbility.description);
});

it('Objective action', () => {
  // TODO
});

it('Quest action', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: ally({
              name: 'Ally',
              willpower: 1,
              attack: 1,
              defense: 1,
              hitPoints: 1,
              sphere: 'leadership',
              traits: [],
              cost: 1,
              unique: false,
            }),
          },
        ],
        library: [emptyCard],
      },
    ],
    questArea: [
      {
        card: quest({
          a: { name: 'Quest A' },
          b: { name: 'Quest B', questPoints: 5, abilities: [drawAbility] },
          sequence: 1,
        }),
        side: 'back',
      },
    ],
  });

  expect(game.actions).toHaveLength(1);
  expect(game.actions[0].description).toBe(drawAbility.description);
});

it('Location action', () => {
  const game = new TestEngine({
    players: [
      {
        library: [emptyCard],
      },
    ],
    activeLocation: [
      location(
        {
          name: 'Location',
          questPoints: 1,
          threat: 1,
          traits: [],
        },
        drawAbility
      ),
    ],
  });

  expect(game.actions).toHaveLength(1);
  expect(game.actions[0].description).toBe(drawAbility.description);
});

it('Out of play action', () => {
  // TODO
});
