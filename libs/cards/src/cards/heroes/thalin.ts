import { hero } from '@card-engine-nx/state';

export const thalin = hero(
  {
    name: 'Thalin',
    threatCost: 9,
    willpower: 1,
    attack: 2,
    defense: 2,
    hitPoints: 4,
    traits: ['dwarf', 'warrior'],
    sphere: 'tactics',
  },
  {
    description:
      'While Thalin is committed to a quest, deal 1 damage to each enemy as it is revealed by the encounter deck.',
    target: { type: 'enemy', zoneType: 'encounterDeck' },
    response: {
      event: 'revealed',
      condition: {
        card: {
          target: 'self',
          value: {
            hasMark: 'questing',
          },
        },
      },
      action: {
        card: 'target',
        action: {
          dealDamage: 1,
        },
      },
    },
  }
);
