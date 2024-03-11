import { it, suite, expect } from 'vitest';
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

suite('Card actions', () => {
  it('Hero', () => {
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

  it('Ally', () => {
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

  it('Attachment', () => {
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

  it('Event', () => {
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
            event(
              { name: 'Event', cost: 0, sphere: 'leadership' },
              drawAbility
            ),
          ],
        },
      ],
    });

    expect(game.actions).toHaveLength(1);
    expect(game.actions[0].description).toBe(drawAbility.description);
  });

  it('Quest', () => {
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

  it('Location', () => {
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

  it.todo('Out of play');

  // it.todo('Objective');
});
