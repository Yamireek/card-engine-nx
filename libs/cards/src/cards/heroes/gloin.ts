import { hero } from '@card-engine-nx/state';

export const gloin = hero(
  {
    name: 'Glóin',
    threatCost: 9,
    willpower: 2,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['dwarf', 'noble'],
    sphere: 'leadership',
  },
  {
    description:
      'After Glóin suffers damage, add 1 resource to his resource pool for each point of damage he just suffered.',
    response: {
      event: 'receivedDamage',
      action: {
        card: 'self',
        action: {
          generateResources: {
            event: { type: 'receivedDamage', value: 'damage' },
          },
        },
      },
    },
  }
);
