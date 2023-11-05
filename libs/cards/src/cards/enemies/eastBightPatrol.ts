import { enemy } from '@card-engine-nx/state';

export const eastBightPatrol = enemy(
  {
    name: 'East Bight Patrol',
    engagement: 5,
    threat: 3,
    attack: 3,
    defense: 1,
    hitPoints: 2,
    traits: ['goblin', 'orc'],
  },
  {
    description:
      'Shadow: attacking enemy gets +1 Attack (If this attack is undefended, also raise your threat by 3.)',
    shadow: [
      {
        card: {
          hasShadow: 'self',
        },
        action: {
          modify: {
            increment: {
              attack: 1,
            },
          },
        },
      },
      {
        if: {
          condition: 'undefended.attack',
          true: {
            player: 'defending',
            action: { incrementThreat: 3 },
          },
        },
      },
    ],
  }
);
