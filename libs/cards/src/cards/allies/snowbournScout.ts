import { ally } from '@card-engine-nx/state';

export const snowbournScout = ally(
  {
    name: 'Snowbourn Scout',
    cost: 1,
    willpower: 0,
    attack: 0,
    defense: 1,
    hitPoints: 1,
    traits: ['rohan', 'scout'],
    sphere: 'leadership',
    unique: false,
  },
  {
    description:
      'Response: After Snowbourn Scout enters play, choose a location. Place 1 progress token on that location.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose location',
            target: { type: 'location' },
            action: { placeProgress: 1 },
          },
        },
      },
    },
  }
);
