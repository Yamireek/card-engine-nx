import { ally } from '@card-engine-nx/state';

export const longbeardOrcSlayer = ally(
  {
    name: 'Longbeard Orc Slayer',
    cost: 4,
    willpower: 0,
    attack: 2,
    defense: 1,
    hitPoints: 3,
    traits: ['dwarf', 'warrior'],
    sphere: 'leadership',
    unique: false,
  },
  {
    description:
      'Response: After Longbeard Orc Slayer enters play, deal 1 damage to each Orc enemy in play.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        card: {
          target: {
            type: 'enemy',
            trait: 'orc',
          },
          action: {
            dealDamage: 1,
          },
        },
      },
    },
  }
);
