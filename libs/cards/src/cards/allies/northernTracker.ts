import { ally } from '@card-engine-nx/state';

export const northernTracker = ally(
  {
    name: 'Northern Tracker',
    cost: 4,
    willpower: 1,
    attack: 2,
    defense: 2,
    hitPoints: 3,
    traits: ['dúnedain', 'ranger'],
    sphere: 'spirit',
    unique: false,
  },
  {
    description:
      'Response: After Northern Tracker commits to a quest, place 1 progress token on each location in the staging area.',
    target: 'self',
    response: {
      event: 'commits',
      action: {
        card: { zoneType: 'stagingArea', type: 'location' },
        action: { placeProgress: 1 },
      },
    },
  }
);
