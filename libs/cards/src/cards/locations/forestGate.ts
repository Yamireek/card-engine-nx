import { location } from '@card-engine-nx/state';

export const forestGate = location(
  {
    name: 'Forest Gate',
    threat: 2,
    questPoints: 4,
    traits: ['forest'],
  },
  {
    description:
      'Response: After you travel to Forest Gate the first player may draw 2 cards.',
    target: 'self',
    response: {
      event: 'traveled',
      action: {
        player: {
          target: 'first',
          action: {
            draw: 2,
          },
        },
      },
    },
  }
);
