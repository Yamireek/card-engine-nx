import { ally } from '@card-engine-nx/state';

export const lorienGuide = ally(
  {
    name: 'Lórien Guide',
    cost: 3,
    willpower: 1,
    attack: 1,
    defense: 0,
    hitPoints: 2,
    traits: ['silvan', 'scout'],
    sphere: 'spirit',
    unique: false,
  },
  {
    description:
      'Response: After Lórien Guide commits to a quest, place 1 progress token on the active location.',
    target: 'self',
    response: {
      event: 'commits',
      action: {
        card: {
          target: { zoneType: 'activeLocation' },
          action: { placeProgress: 1 },
        },
      },
    },
  }
);
