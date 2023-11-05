import { location } from '@card-engine-nx/state';

export const oldForestRoad = location(
  {
    name: 'Old Forest Road',
    threat: 1,
    questPoints: 3,
    traits: ['forest'],
  },
  {
    description:
      'Response: After you travel to Old Forest Road the first player may choose and ready 1 character he controls.',
    target: 'self',
    response: {
      event: 'traveled',
      action: {
        player: {
          target: 'first',
          action: {
            chooseCardActions: {
              title: 'Ready 1 character',
              target: 'character',
              action: 'ready',
            },
          },
        },
      },
    },
  }
);
